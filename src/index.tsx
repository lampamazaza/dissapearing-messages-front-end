import "./styles/index.css";
import { render } from "solid-js/web";

import App from "./App";
import { AuthenticationContextProvider } from "./components/Authentication/AuthenticationContext/AuthenticationContext";

const root = document.getElementById("root");
root.innerHTML = "";

render(
  () => (
    <AuthenticationContextProvider>
        <App />
    </AuthenticationContextProvider>
  ),
  root as HTMLElement
);
