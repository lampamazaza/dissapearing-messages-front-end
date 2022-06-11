export function Message(props) {
  return (
    <div class="relative m-[5px] px-[7px] max-w-sm rounded-lg border bg-white border-gray-200  dark:bg-gray-800 dark:border-gray-700">
      <p class="text-14 text-gray-700 dark:text-gray-400">{props.name}</p>
      <p class="text-16  mb-[12px] text-gray-700 dark:text-gray-400">
        {props.text}
      </p>
      <p class="absolute right-[4px] bottom-[2px] text-10 text-gray-700 dark:text-gray-400">
        {new Date(props.date).toLocaleString("en-Us", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </p>
    </div>
  );
}
