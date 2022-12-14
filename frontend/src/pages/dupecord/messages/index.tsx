import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMessages } from "../../../redux/api";
import type { Message } from "../../../redux/api/api.types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import VideoChat from "../video";
import CreateMessage from "./createMessage";
import ChannelMessages from "./messages";

export default function Messages() {
  const dispatch = useAppDispatch();
  const params: { id?: number } = useParams();

  const [messages, setMessages] = useState<Message[]>([]);
  const [skip] = useState(0);
  const [take] = useState(10);

  const allMessages = useAppSelector((state) => state.api.messages);
  const currentChannel = useAppSelector((state) => state.api.currentChannel);

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
      {currentChannel && currentChannel.category.name.includes('Voice') && (
        <div className="w-full h-full border-b border-gray-400 overflow-auto">
          <VideoChat />
        </div>
      )}
      <ChannelMessages messages={messages} setMessages={setMessages} />
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