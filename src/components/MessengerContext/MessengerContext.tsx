import {
  createResource,
  createEffect,
  createContext,
  useContext,
  createSignal,
  onMount,
  batch,
} from "solid-js";
import { initMessengerApi } from "./api";
import { getCurrentHashValue, findUserInChats, normalizeByKey } from "./utils";
import { useAuthenctionContext } from "@/components/Authentication/AuthenticationContext/AuthenticationContext";

export const MessengerContext = createContext();

let api = null;

export function MessengerContextProvider(props) {
  const { accessToken } = useAuthenctionContext();
  const [currentUser, setCurrentUser] = createSignal(null);

  const [
    currentOpenedCorrespondentPublicKey,
    setCurrentOpenedCorrespondentPublicKey,
  ] = createSignal(getCurrentHashValue());

  addEventListener("hashchange", () => {
    const currentHashValue = getCurrentHashValue();
    setCurrentOpenedCorrespondentPublicKey(currentHashValue);
  });

  const [chats, setChats] = createSignal([]);
  const [messages, setMessages] = createSignal({});
  const [isInited, setIsInited] = createSignal(false);

  const init = async () => {
    if (!isInited()) {
      api = initMessengerApi(accessToken());
      const alias = currentOpenedCorrespondentPublicKey();
      //init
      const chats = await api.getChatsByUserId(currentUser().publicKey);
      let currentChatMessages = [];
      let correspondentPublicKey = "";
      if (alias) {
        const user = chats.find(({ user }) => user.alias === alias);
        if (!user) {
          // Unkown guy
          const { name, publicKey } = await api.getUserByAlias(alias);
          chats.unshift({
            user: { name, publicKey, alias },
            publicKey,
            lastMessage: {
              text: "",
            },
          });
          correspondentPublicKey = publicKey;
        } else {
          currentChatMessages = await api.getMessagesInChat(alias);
          correspondentPublicKey = user.publicKey;
        }
      }

      batch(() => {
        setChats(normalizeByKey(chats, "publicKey"));
        setMessages(
          correspondentPublicKey
            ? { [correspondentPublicKey]: currentChatMessages }
            : {}
        );
        setIsInited(true);
      });
      startPolling();
    }
  };

  createEffect(async () => {
    if (currentUser() !== null && accessToken() !== null) {
      init();
    }
  });

  async function startPolling() {
    try {
      const activeChatPublicKey = getCurrentHashValue();
      const data = await api.pollingSubscriber();
      for (let publicKey in data) {
        if (publicKey === activeChatPublicKey) {
          const messagesToAdd = data[activeChatPublicKey];
          setMessages((value) => ({
            ...value,
            ...{
              [activeChatPublicKey]:
                value[activeChatPublicKey].concat(messagesToAdd),
            },
          }));
          setChats((value) => {
            return {
              ...value,
              ...{
                [publicKey]: Object.assign({}, value[publicKey], {
                  lastMessage: messagesToAdd.text,
                }),
              },
            };
          });
        } else {
          if (!chats()[publicKey]) {
            // Unkown guy
            const { name, alias } = await api.getUserbyPublicKey(publicKey);
            const newChat = {
              user: { name, publicKey, alias },
              publicKey,
              lastMessage: data[publicKey].pop(),
            };
            setChats((value) => {
              return {
                ...value,
                ...{
                  [publicKey]: newChat,
                },
              };
            });
          } else {
            setChats((value) => {
              return {
                ...value,
                ...{
                  [publicKey]: Object.assign({}, value[publicKey], {
                    lastMessage: data[publicKey].pop(),
                  }),
                },
              };
            });
          }
        }
      }
      setTimeout(() => startPolling(), 2000);
    } catch (error) {
      console.error(error);
    }
  }

  createEffect(async () => {
    const inited = isInited();
    const currentCorrespondentPublicKey = currentOpenedCorrespondentPublicKey();
    if (
      inited &&
      currentCorrespondentPublicKey &&
      !messages[currentCorrespondentPublicKey]
    ) {
      //init
      const newMessages = await api.getMessagesInChat(
        currentCorrespondentPublicKey
      );
      setMessages((messages) => ({
        ...messages,
        ...{ [currentCorrespondentPublicKey]: newMessages },
      }));
    }
  });

  async function send(message) {
    const toPublicKey = currentOpenedCorrespondentPublicKey();
    const result = await api.sendMessage({
      toPublicKey,
      message: message,
    });
    console.log(toPublicKey);
    console.log(messages());
    setMessages((value) => ({
      ...value,
      ...{
        [toPublicKey]: value[toPublicKey].concat(result),
      },
    }));

    setChats((value) => {
      return {
        ...value,
        ...{
          [toPublicKey]: Object.assign({}, value[toPublicKey], {
            lastMessage: result,
          }),
        },
      };
    });
  }

  return (
    <MessengerContext.Provider
      value={{
        chats: () => Object.values(chats()),
        messages: () => messages()[currentOpenedCorrespondentPublicKey()],
        currentCorrespondent: () =>
          chats()[currentOpenedCorrespondentPublicKey()],
        sendMessage: send,
        currentUser,
        setCurrentUser,
      }}
    >
      {props.children}
    </MessengerContext.Provider>
  );
}

export function useMessenger() {
  return useContext(MessengerContext);
}
