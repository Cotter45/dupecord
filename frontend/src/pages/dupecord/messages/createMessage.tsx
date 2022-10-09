import { FormEvent, useState } from "react";
import { useSocket } from "../../../context/ws";
import { createChannelMessage } from "../../../redux/api";
import type { Message } from "../../../redux/api/api.types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

export default function CreateMessage({
  messages,
  setMessages,
  channelId,
}: {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  channelId: number;
}) {
  const dispatch = useAppDispatch();
  const socket = useSocket();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const user = useAppSelector((state) => state.session.user);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (message.length === 0) {
      setError("Message cannot be empty");
    } else {
      setError("");
    }

    let newMessage: any = {
      content: message,
      channelId,
      authorId: user?.id,
    }
    
    newMessage = await dispatch(createChannelMessage(newMessage));
    if (newMessage && 
      newMessage.payload &&
      newMessage.payload.id
      ) {
      setMessages([...messages, newMessage.payload]);
      if (socket && socket.current !== null) {
        socket.current.emit('message', { type: 'channel-message', data: { message: newMessage.payload } });
      }
      return setMessage("");
    }
    setError("Something went wrong");
  }

  return (
    <div
      style={{ borderRadius: "5px 5px 0 0" }}
      className="w-full h-[50px] bg-neutral-700 p-2"
    >
      <form onSubmit={handleSubmit} className="relative w-full">
        <input
          type="text"
          value={message}
          autoFocus
          onChange={(e) => setMessage(e.target.value)}
          className="w-full h-full p-2 rounded-md"
          placeholder="Write your stuff here"
        />
        <i onClick={handleSubmit} className="fa-solid fa-paper-plane absolute right-2 top-[25%] cursor-pointer hover:text-violet-600"></i>
      </form>
    </div>
  );
}