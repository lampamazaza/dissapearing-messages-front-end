export function UserPanel(props: { name: string }) {
  return (
    <div class="p-8 bg-white border-b h-50  border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      {props.name}
    </div>
  );
}
