import { MessageInput } from "./MessageInput";

const MESSAGE_FORM = "messageForm";

export function ControlPanel(props) {
  const onSubmit = async (event) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const msg = (formData.get("message") as string).trim();
    if (msg) {
      await props.onSend(msg);
      form.reset();
    }
  };

  const onPressEnter = async () => {
    try {
      const form = document.getElementById(MESSAGE_FORM) as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form id={MESSAGE_FORM} onsubmit={onSubmit}>
      <label for="chat" class="sr-only">
        Your message
      </label>
      <div class="flex items-center p-10 bg-gray-50 rounded-lg dark:bg-gray-700">
        <MessageInput id="message" name="message" onSubmit={onPressEnter} maxLength={500} required={true}  />
        <button
          type="submit"
          class="inline-flex justify-center p-10 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
        >
          <svg
            class="rotate-90 w-24 h-24"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
          </svg>
        </button>
      </div>
    </form>
  );
}
