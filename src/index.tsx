/* @refresh reload */
import "./styles/index.css";
import { render } from "solid-js/web";

import App from "./App";
import { MessengerContextProvider } from "./components/MessengerContext/MessengerContext";
import { AuthenticationContextProvider } from "./components/Authentication/AuthenticationContext/AuthenticationContext";

const root = document.getElementById("root");
root.innerHTML = "";

render(
  () => (
    <AuthenticationContextProvider>
      <MessengerContextProvider>
        <App />
      </MessengerContextProvider>
    </AuthenticationContextProvider>
  ),
  root as HTMLElement
);
