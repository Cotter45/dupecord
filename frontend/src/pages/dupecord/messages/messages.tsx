import { FormEvent, MutableRefObject, useEffect, useRef, useState } from "react";

import useOnScreen from "../../../util/useOnScreen";
import type { Message } from "../../../redux/api/api.types";
import { authFetch } from "../../../util/authFetch";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { deleteMessage, likeMessage, unlikeMessage, updateMessage } from "../../../redux/api";
import { Modal } from "../../../context/modal/modal";
import { useParams } from "react-router-dom";

export default function MessagesContainer({
  messages,
  setMessages,
}: {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) {
  const dispatch = useAppDispatch();
  const params: { id?: number } = useParams();
  const paginationRef = useRef<any>(null);

  const isIntersecting = useOnScreen(
    paginationRef,
    "0px",
  );

  const [edit, setEdit] = useState(false);
  const [messageEdit, setMessageEdit] = useState('');
  const [messageMark, setMessageMark] = useState<Message | null>(null);
  const [showModal, setShowModal] = useState(false);

  const user = useAppSelector((state) => state.session.user);
  const likedMessages = useAppSelector((state) => state.api.likedMessages);

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();

    if (messageEdit.length === 0) {
      return;
    }

    const res = await dispatch(updateMessage({
      ...messageMark,
      content: messageEdit,
    }));

    if (res && res.payload) {
      setMessages(messages.map((message) => {
        if (message.id === messageMark?.id) {
          return res.payload;
        }
        return message;
      }));
    }
    setEdit(false);
  };

  const handleDelete = async () => {
    if (!messageMark) {
      return;
    }

    const res = await dispatch(deleteMessage(messageMark));

    if (res && res.payload) {
      setMessages(messages.filter((message) => message.id !== messageMark.id));
    }
    setShowModal(false);
  };

  useEffect(() => {
    if (isIntersecting) {
      (async () => {
        if (!messages.length) return;
        const moreMessages = await authFetch(`/api/messages/${params.id}?skip=${messages.length}&take=10`);

        setMessages([...messages, ...moreMessages.messages]);
      })();
    }
  }, [isIntersecting, messages, params.id]);

  return (
    <div
      id="messages-container"
      style={{ borderRadius: "0 0 5px 5px" }}
      className="fade_in w-[calc(100%+28px)] h-full overflow-hidden overflow-y-auto flex flex-col-reverse py-4 -translate-x-[14px]"
    >
      <div id="scroller" className="h-0 w-0" />
      {messages
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
        )
        .map((message) => (
          <div
            key={message.id}
            className="fade_in w-full flex gap-4 py-2 items-center"
          >
            <div className="w-[40px] h-[35px]">
              <img
                src={message.author?.profilePicture}
                alt="avatar"
                className="w-full h-full rounded-full"
              />
            </div>
            <div className="w-full flex flex-col">
              <div className="flex items-center justify-between ">
                <div className="font-bold text-neutral-100">
                  <label>{message.author.username}</label>
                  {user && message.authorId !== user.id && (
                    <i
                      onClick={() => {
                        const liked = likedMessages.includes(message.id);
                        if (!liked) {
                          dispatch(
                            likeMessage({
                              messageId: message.id,
                              userId: user.id,
                            })
                          );
                          return;
                        }
                        dispatch(
                          unlikeMessage({
                            messageId: message.id,
                            userId: user.id,
                          })
                        );
                      }}
                      className={`fa-solid fa-heart text-xs pl-2 cursor-pointer hover:scale-125 transition-all ease-in-out duration-500 ${
                        likedMessages.includes(message.id)
                          ? "text-red-700 scale-110"
                          : "text-neutral-400"
                      }`}
                    ></i>
                  )}
                </div>

                <div className="flex gap-2 items-center pr-2">
                  <div className="text-neutral-400 text-xs">
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                  {user && user.id === message.authorId && (
                    <div
                      onClick={() => {
                        setMessageMark(message);
                        setMessageEdit(message.content);
                        setEdit(!edit);
                      }}
                      className="flex items-center justify-between w-[20px] cursor-pointer shadow-md hover:bg-neutral-600 py-1"
                    >
                      <div className="w-[5px] h-[5px] bg-neutral-400 rounded-full"></div>
                      <div className="w-[5px] h-[5px] bg-neutral-400 rounded-full"></div>
                      <div className="w-[5px] h-[5px] bg-neutral-400 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
              {edit && messageMark && messageMark.id === message.id ? (
                <div className="flex flex-col gap-2">
                  <form onSubmit={(e) => handleEdit(e)}>
                    <input
                      value={messageEdit}
                      onChange={(e) => setMessageEdit(e.target.value)}
                      type="text"
                      className="w-[98%] bg-neutral-700 rounded-md px-2 py-1"
                    />
                  </form>
                  <div className="w-[60%] max-w-[400px] self-end flex items-center gap-2 pr-2">
                    <button
                      onClick={() => setShowModal(true)}
                      className="w-[40%] bg-red-500 rounded-md px-2 py-1"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setEdit(false);
                      }}
                      className="w-[40%] bg-neutral-700 rounded-md px-2 py-1"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={(e) => handleEdit(e)}
                      className="w-[40%] bg-neutral-700 rounded-md px-2 py-1"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-neutral-100">{message.content}</div>
              )}
            </div>
          </div>
        ))}
      <div ref={paginationRef} className="h-0 w-0" />
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="w-full flex flex-col gap-2 bg-neutral-800 p-6 rounded-md max-w-[700px]">
            <h2 className="w-full text-2xl text-center">
              Delete Message "{messageMark?.content}"
            </h2>
            <p className="w-full text-center">
              Are you sure you want to delete this Message?
            </p>
            <div className="w-full flex flex-row gap-2">
              <button
                onClick={handleDelete}
                className="w-full p-2 text-white bg-red-500 mt-4 rounded-md"
              >
                Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full p-2 rounded-md mt-4 border border-neutral-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
