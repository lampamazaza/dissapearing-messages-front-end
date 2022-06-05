export function Message(props) {
  return (
    <div class="m-2 p-2 max-w-sm rounded-lg border border-gray-200  dark:bg-gray-800 dark:border-gray-700">
      <p class="font-normal text-gray-700 dark:text-gray-400">{props.text}</p>
    </div>
  );
}
