import {
  createResource,
  createEffect,
  createContext,
  useContext,
  createSignal,
} from "solid-js";
import {
  getChatsByUserId,
  getMessagesInChat,
  sendMessage,
  pollingSubscriber,
} from "./api";
import { getCurrentHashValue } from "./utils";
export const MessengerContext = createContext();

export function MessengerContextProvider(props) {
  const [
    currentOpenedCorrespondentPublicKey,
    setcurrentOpenedCorrespondentPublicKey,
  ] = createSignal(getCurrentHashValue());

  addEventListener("hashchange", () => {
    setcurrentOpenedCorrespondentPublicKey(getCurrentHashValue());
  });

  const [chats] = createResource("a", getChatsByUserId);
  const [messages] = createResource(
    currentOpenedCorrespondentPublicKey,
    getMessagesInChat
  );
  const [currentCorrespondent, setCurrentCorrespondent] = createSignal(
    chats()?.find(
      ({ user: { publicKey } }) =>
        publicKey === currentOpenedCorrespondentPublicKey
    )
  );

  createEffect(() => {
    const allChats = chats();
    const currentCorrespondentPublicKey = currentOpenedCorrespondentPublicKey();
    if (allChats && currentCorrespondentPublicKey) {
      const newCurrentCorrespondent = allChats.find(
        ({ user: { publicKey } }) => publicKey === currentCorrespondentPublicKey
      );
      setCurrentCorrespondent(newCurrentCorrespondent);
    }
  });

  pollingSubscriber();

  async function send(message) {
    const result = await sendMessage({
      toPublicKey: currentCorrespondent().user.publicKey,
      from: "a",
      message: message,
    });
    console.log(result);
  }
  // // console.log(chats());
  // const [state, setState] = createStore({ count: props.count || 0 });
  // const store = [
  //   state,
  //   {
  //     increment() {
  //       setState("count", (c) => c + 1);
  //     },
  //     decrement() {
  //       setState("count", (c) => c - 1);
  //     },
  //   },
  // ];
  return (
    <MessengerContext.Provider
      value={{ chats, messages, currentCorrespondent, sendMessage: send }}
    >
      {props.children}
    </MessengerContext.Provider>
  );
}

export function useMessenger() {
  return useContext(MessengerContext);
}
