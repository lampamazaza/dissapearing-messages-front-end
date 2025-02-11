import {
  batch,
  createEffect,
  createContext,
  useContext,
  createSignal,
  Accessor,
} from "solid-js";
import { initMessengerService } from "@/services/messaging";
import { initMessengerTransportService } from "@/transport/messages";
import { initMessageCryptoService } from "@/services/messageCryptoService";
import { getCurrentHashValue, normalizeByKey } from "./utils";
import { Chat, Message } from "@/types/api";
import { MessengerChat } from "./types";
import baton from "@/services/baton";
import { initMessagesUpdatesService } from "@/services/updatesService";

export const MessengerContext = createContext<{
  chats: Accessor<MessengerChat[]>;
  messages: Accessor<Message[]>;
  currentCorrespondent: Accessor<Chat>;
  sendMessage: (message: string) => Promise<void>;
}>();

export function MessengerContextProvider(props) {
  const currentUser = props.currentUser;
  const resetOnAuthTokenExpired = props.resetOnAuthTokenExpired;
  const messageEncryptionService = initMessageCryptoService({
    currentUserPrivateKey: props.privateKey(),
  });

  const msgService = initMessengerService({
    transportService: initMessengerTransportService({
      onAuthFail: () => resetOnAuthTokenExpired(),
    }),
    messageEncryptionService,
  });

  initMessagesUpdatesService({
    onUpdate: (data: Message) => startPolling(data),
    messageEncryptionService,
    userIdentifier: currentUser().publicKey,
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
      const chats = (await msgService.getChatsByUserId()) as MessengerChat[];
      let currentChatMessages = [];
      let correspondentPublicKey = "";
      if (alias) {
        const user = chats.find(({ user }) => user.alias === alias);
        if (!user) {
          // Unknown guy
          const user = await msgService.getUserByAlias(alias);
          if (user) {
            chats.unshift({
              user: {
                id: user.id,
                name: user.name,
                publicKey: user.publicKey,
                alias,
              },
              publicKey: user.publicKey,
              lastMessage: {
                text: `Type smth to ${user.name}`,
              },
            });
            correspondentPublicKey = user.publicKey;
          } else {
            baton.error(`User ${user.name} doesn't exist`);
          }
        } else {
          currentChatMessages = await msgService.getMessagesInChat(
            user.publicKey
          );
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
    }
  };

  createEffect(async () => {
    if (currentUser() !== null) {
      init();
    }
  });

  async function startPolling(message: Message) {
    try {
      if (currentUser() !== null) {
        const activeChatPublicKey = currentOpenedCorrespondentPublicKey();
        const publicKey = message.sender;
        if (publicKey === activeChatPublicKey) {
          batch(() => {
            setMessages((value) => ({
              ...value,
              ...{
                [activeChatPublicKey]: value[activeChatPublicKey].concat([
                  message,
                ]),
              },
            }));
            setChats((value) => {
              return {
                ...value,
                ...{
                  [publicKey]: Object.assign({}, value[publicKey], {
                    lastMessage: message,
                  }),
                },
              };
            });
          });
        } else {
          if (!chats()[publicKey]) {
            // Unkown guy
            const { name, alias } = await msgService.getUserbyPublicKey(
              publicKey
            );
            const newChat = {
              user: { name, publicKey, alias },
              publicKey,
              lastMessage: message,
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
                    lastMessage: message,
                  }),
                },
              };
            });
          }
        }
      }
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
      const newMessages = await msgService.getMessagesInChat(
        currentCorrespondentPublicKey
      );
      setMessages((messages) => ({
        ...messages,
        ...{ [currentCorrespondentPublicKey]: newMessages },
      }));
    }
  });

  async function send(message: string) {
    const toPublicKey = currentOpenedCorrespondentPublicKey();
    const result = await msgService.sendMessage({
      toPublicKey,
      message: message,
    });

    result.text = message;

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
