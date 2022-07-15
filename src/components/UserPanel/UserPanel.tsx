export function UserPanel(props: { name: string }) {
  return (
    <div class="flex items-center p-8 bg-white border-b h-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div class="d:hidden mr-20">
        <a href="#">🔙</a>
      </div>
      <div class="max-w-[80%] truncate">{props.name}</div>
    </div>
  );
}
