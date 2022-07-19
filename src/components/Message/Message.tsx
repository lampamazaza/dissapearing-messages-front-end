export function Message(props) {
  return (
    <div class="relative m-[5px] px-[7px] max-w-sm rounded-lg border bg-white border-gray-200">
      <p class={`text-14 font-bold ${props.isMine ? "text-red-600" : "text-blue-600"}`}>{props.name}</p>
      <p class="text-16 mb-12 text-gray-700 break-all">
        {props.text}
      </p>
      <p class="absolute right-4 bottom-2 text-10 text-gray-700">
        {new Date(props.date).toLocaleString("en-Us", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </p>
    </div>
  );
}
