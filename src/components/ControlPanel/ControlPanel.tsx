import baton from "@/services/baton";
import { createSignal } from "solid-js";
import { MessageInput } from "./MessageInput";

export function ControlPanel(props) {
  const [value, setValue] = createSignal("")
  const [isSubmitting, setIsSubmitting] = createSignal(false)

  const onSubmit = async () => {
    const currentValue = value()
    if (currentValue.trim() === "") {
      baton.error("Can't send an empty message")
      return
    }
    try {
      setIsSubmitting(true)
      await props.onSend(currentValue);
      setValue("")
    } catch (error) {
      baton.error("Failed to send a message")
    } finally {
      setIsSubmitting(false)
    }
  };

  const onPressEnter = async () => {
    try {
      onSubmit()
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div class="flex items-center p-10 bg-gray-50 rounded-lg">
      <MessageInput id="message" name="message" onSubmit={onPressEnter} value={value} maxLength={500} required={true} setValue={setValue} />
      <button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting()}
        class="inline-flex justify-center p-10 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100"
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
  );
}
