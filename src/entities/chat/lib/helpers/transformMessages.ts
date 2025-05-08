import { IMessage } from "react-native-gifted-chat";
import { Message as MessageType } from "@/src/entities/chat/model/types";

export const transformMessages = (messages: MessageType[]): IMessage[] =>
  messages.map((msg) => ({
    _id: msg.id,
    text: msg.content,
    createdAt: new Date(msg.created_at).toString(),
    user: {
      _id: msg.user_id,
    },
  }));
