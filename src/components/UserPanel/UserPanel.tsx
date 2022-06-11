export function UserPanel(props: { name: string }) {
  return (
    <div class="p-2 bg-white border-b h-[50px]  border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      {props.name}
    </div>
  );
}
