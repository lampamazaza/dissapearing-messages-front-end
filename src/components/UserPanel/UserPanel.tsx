export function UserPanel(props: { name: string }) {
  return (
    <div class="bg-white border-b p-2  border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      {props.name}
    </div>
  );
}
