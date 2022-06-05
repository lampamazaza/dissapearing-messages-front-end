export const ConversationItem = (props: {
  name: string;
  lastMessage: string;
  alias?: string;
  publicKey?: string;
}) => {
  return (
    <a
      href={`#${props.publicKey}`}
      class="flex flex-col cursor-pointer p-6 bg-white   hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
    >
      <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        {props.name}
      </h5>
      <p class="font-normal text-gray-700 dark:text-gray-400">
        {props.lastMessage}
      </p>
    </a>
  );
};
