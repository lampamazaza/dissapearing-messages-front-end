/* @refresh reload */
import "./styles/index.css";
import { render } from "solid-js/web";

import App from "./App";
import { MessengerContextProvider } from "./components/MessengerContext/MessengerContext";

render(
  () => (
    <MessengerContextProvider>
      <App />
    </MessengerContextProvider>
  ),
  document.getElementById("root") as HTMLElement
);
