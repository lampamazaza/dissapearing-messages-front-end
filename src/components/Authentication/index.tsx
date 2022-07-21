import { AuthenticatePanel } from "./AuthenticatePanel";
import { CreateAccount } from "./CreateAccount";
import { useAuthenctionContext } from "./AuthenticationContext/AuthenticationContext";
import { useMessenger } from "../MessengerContext";
import { effect } from "solid-js/web";
import { Welcome } from "./Welcome";
import { createSignal, Switch, Match } from "solid-js";
enum AUTH_STEPS {
  INITIAL,
  CREATE_ACCOUNT,
  AUTHENTICATE,
}

export function Authentication(props) {
  const [step, setStep] = createSignal(AUTH_STEPS.INITIAL);

  const onCreateUser = async (newUserData: {
    name: string;
    alias: string;
    password: string;
  }) => {
    await props.createUser(newUserData);
    await props.authenticate(newUserData);
  };

  const onAuthenticate = async (payload: {
    alias: string;
    password: string;
  }) => {
    await props.authenticate(payload);
  };

  const toAuth = () => setStep(AUTH_STEPS.AUTHENTICATE);
  const toCreateAccount = () => setStep(AUTH_STEPS.CREATE_ACCOUNT);
  const toWelcome = () => setStep(AUTH_STEPS.INITIAL);

  return (
    <div class="bg-main">
      <Switch>
        <Match when={step() === AUTH_STEPS.INITIAL}>
          <Welcome toAuth={toAuth} toCreateAccount={toCreateAccount} />
        </Match>
        <Match when={step() === AUTH_STEPS.CREATE_ACCOUNT}>
          <CreateAccount createUser={onCreateUser} back={toWelcome} />
        </Match>
        <Match when={step() === AUTH_STEPS.AUTHENTICATE}>
          <AuthenticatePanel back={toWelcome} authenticate={onAuthenticate} />
        </Match>
      </Switch>
    </div>
  );
}
