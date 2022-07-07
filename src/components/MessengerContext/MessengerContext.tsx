import {
  batch,
  createEffect,
  createContext,
  useContext,
  createSignal,
} from "solid-js";
import { useAuthenctionContext } from "../Authentication/AuthenticationContext/AuthenticationContext";
import { initMessengerApi } from "./api";
import { getCurrentHashValue, normalizeByKey } from "./utils";

export const MessengerContext = createContext();

export function MessengerContextProvider(props) {
  const { currentUser, resetOnAuthTokenExpired } = useAuthenctionContext();
  const api = initMessengerApi({
    onAuthFail: () => resetOnAuthTokenExpired(),
  });

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
      const alias = new URLSearchParams(window.location.search).get("m");
      //init
      const chats = await api.getChatsByUserId();
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
        if (correspondentPublicKey) {
          window.location.hash = correspondentPublicKey;
        }
      });
      startPolling();
    }
  };

  createEffect(async () => {
    if (currentUser() !== null) {
      init();
    }
  });

  async function startPolling() {
    try {
      const data = await api.pollingSubscriber();
      const activeChatPublicKey = currentOpenedCorrespondentPublicKey();
      for (let publicKey in data) {
        if (publicKey === activeChatPublicKey) {
          const messagesToAdd = data[activeChatPublicKey];
          batch(() => {
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
                    lastMessage: messagesToAdd.pop(),
                  }),
                },
              };
            });
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
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => startPolling(), 2000);
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

    batch(() => {
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
      }}
    >
      {props.children}
    </MessengerContext.Provider>
  );
}

export function useMessenger() {
  return useContext(MessengerContext);
}
