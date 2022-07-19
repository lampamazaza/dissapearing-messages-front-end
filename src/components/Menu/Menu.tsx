import { createEffect, children } from "solid-js";

export const Menu = (props: { children }) => {
  const c = children(() => props.children);
  return (
    <div class="bg-white border-r border-gray-200 relative">
      {c()}
    </div>
  );
};
