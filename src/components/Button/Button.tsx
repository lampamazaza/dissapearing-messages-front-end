export function Button(props) {
  return (
    <button
      onClick={props.onClick}
      class="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
    >
      {props.children}
    </button>
  );
}
