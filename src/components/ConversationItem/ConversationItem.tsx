export const ConversationItem = (props: {
  name: string;
  lastMessage: string;
  alias?: string;
  publicKey?: string;
  isActive: boolean;
}) => {
  return (
    <a
      href={`#${props.publicKey}`}
      class={`flex flex-col cursor-pointer p-20 ${
        props.isActive ? "bg-gray-100" : "bg-white"
      } dark:bg-gray-800 dark:hover:bg-gray-700`}
    >
      <h5 class="text-20 font-bold tracking-tight text-gray-900 dark:text-white max-w-[80%] truncate">
        {props.name}
      </h5>
      <p class="font-normal text-14 text-gray-700 dark:text-gray-400 max-w-[80%] truncate">
        {props.lastMessage
          ? props.lastMessage
          : "Type something to start chatting"}
      </p>
    </a>
  );
};
