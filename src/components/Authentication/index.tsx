import { AuthenticatePanel } from "./AuthenticatePanel";
import { EnterPasscode } from "./EnterPasscode";
import { CreateAccount } from "./CreateAccount";
import { Welcome } from "./Welcome";
import { createSignal, Switch, Match } from "solid-js";

enum AUTH_STEPS {
  INITIAL,
  CREATE_ACCOUNT,
  AUTHENTICATE,
  ENTER_PASS,
}

export function Authentication(props) {
  const [step, setStep] = createSignal(
    props.needToUnlockOnly ? AUTH_STEPS.ENTER_PASS : AUTH_STEPS.INITIAL
  );

  const onCreateUser = async (newUserData: {
    name: string;
    alias: string;
    passcode: string;
  }) => {
    await props.createUser(newUserData);
    await props.authenticate(newUserData);
  };

  const onAuthenticate = async (payload: {
    alias: string;
    passcode: string;
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
        <Match when={step() === AUTH_STEPS.ENTER_PASS}>
          <EnterPasscode
            back={toWelcome}
            unlockWithPasscode={props.unlockWithPasscode}
          />
        </Match>
      </Switch>
    </div>
  );
}
