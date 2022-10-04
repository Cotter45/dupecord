import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMessages } from "../../../redux/api";
import type { Message } from "../../../redux/api/api.types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import CreateMessage from "./createMessage";
import MessagesContainer from "./messages";

export default function Messages() {
  const dispatch = useAppDispatch();
  const params: { id?: number } = useParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [skip] = useState(0);
  const [take] = useState(10);
  const allMessages = useAppSelector((state) => state.api.messages);

  useEffect(() => {
    if (!params.id) return;

    const messagesExist = allMessages[params.id];

    if (messagesExist) {
      setMessages(messagesExist);
    } else {
      dispatch(getMessages({ channelId: params.id, skip, take }));
    }
  }, [params.id, allMessages, dispatch]);

  return (
    <div className="fade_in h-full w-full flex flex-col">
      <MessagesContainer messages={messages} setMessages={setMessages} />
      {params.id && (
        <CreateMessage 
          messages={messages}
          setMessages={setMessages}
          channelId={params.id}
        />
      )}
    </div>
  );
}