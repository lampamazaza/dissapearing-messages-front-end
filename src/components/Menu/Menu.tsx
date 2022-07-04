import { createEffect, children } from "solid-js";

export const Menu = (props: { children }) => {
  const c = children(() => props.children);
  return (
    <div class="bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 relative">
      {c()}
    </div>
  );
};
