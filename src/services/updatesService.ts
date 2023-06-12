import { Message } from "@/types/api";
import { IMessageEncryptionService } from "@/services/messageCryptoService";
import { io } from "socket.io-client";

export function initMessagesUpdatesService({
  onUpdate,
  userIdentifier,
  messageEncryptionService,
}: {
  onUpdate: (data: Message) => void;
  messageEncryptionService: IMessageEncryptionService;
  userIdentifier: string;
}) {
  const PRIVATE_KEY_QUERY_PARAM_NAME = "pk";
  const socket = io(import.meta.env.VITE_UPDATES_ROOT, {
    withCredentials: true,
    query: {
      [PRIVATE_KEY_QUERY_PARAM_NAME]: userIdentifier,
    },
  });
  socket.connect();
  socket.emit("subscribe", userIdentifier);
  socket.on("update", (message) => {
    message.text = messageEncryptionService.decrypt(
      message.text,
      message.sender
    );

    onUpdate(message);
  });
}
