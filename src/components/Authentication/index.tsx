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

export function Authentication() {
  const { createUser, authenticate } = useAuthenctionContext();
  const { currentUser, setCurrentUser } = useMessenger();
  const [step, setStep] = createSignal(AUTH_STEPS.INITIAL);

  const onCreateUser = async (newUserData: {
    name: string;
    alias: string;
    password: string;
  }) => {
    const createdUser = await createUser(newUserData);
    await authenticate(newUserData);
    setCurrentUser(createdUser);
  };

  const onAuthenticate = async (payload: {
    alias: string;
    password: string;
  }) => {
    const { user } = await authenticate(payload);
    setCurrentUser(user);
  };

  const toAuth = () => setStep(AUTH_STEPS.AUTHENTICATE);
  const toCreateAccount = () => setStep(AUTH_STEPS.CREATE_ACCOUNT);
  const toWelcome = () => setStep(AUTH_STEPS.INITIAL);

  return (
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
  );
}
