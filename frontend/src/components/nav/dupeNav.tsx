import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../context/modal/modal";
import { useSocket } from "../../context/ws";
import { deafenOrUndeafen, muteOrUnmute } from "../../redux/api";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/session";

export default function DupeNav() {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.session.user);
  const muted = useAppSelector((state) => state.api.muted);
  const deafened = useAppSelector((state) => state.api.deafened);

  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);

  return (
    <div className="sticky bottom-0 z-1 w-full h-[40px] justify-self-end self-end flex justify-between items-center p-2 border-t border-neutral-400 bg-neutral-800">
      <label className="text-lg text-neutral-300 truncate">
        {user?.username}
      </label>
      <div className="flex flex-row gap-2 px-2">
        {muted ? (
          <i
            onClick={() => dispatch(muteOrUnmute())}
            className="fa-solid fa-microphone-slash text-red-700 cursor-pointer hover:text-neutral-500"
          ></i>
        ) : (
          <i
            onClick={() => dispatch(muteOrUnmute())}
            className="fa-solid fa-microphone text-neutral-300 cursor-pointer hover:text-neutral-500"
          ></i>
        )}
        {deafened ? (
          <i
            onClick={() => dispatch(deafenOrUndeafen())}
            className="fa-solid fa-phone-slash text-red-700 cursor-pointer hover:text-neutral-500"
          ></i>
        ) : (
          <i
            onClick={() => dispatch(deafenOrUndeafen())}
            className="fa-solid fa-phone text-neutral-300 cursor-pointer hover:text-neutral-500"
          ></i>
        )}
        <i
          onClick={() => setIsOpen(!isOpen)}
          className="fa-solid fa-gear text-neutral-300 cursor-pointer hover:text-neutral-500"
        ></i>
      </div>
      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <div className="w-full h-full flex flex-col items-center border border-neutral-600 rounded bg-neutral-700">
            <div
              data-testid="menu_logout_button"
              onClick={async () => {
                socket &&
                  socket.current &&
                  socket.current.emit("message", {
                    type: "logout",
                    data: { id: user?.id },
                  });
                setIsOpen(!isOpen);
                await dispatch(logout());
                navigate("/login");
              }}
              className="w-full max-w-[400px] h-14 flex justify-center items-center whitespace-nowrap text-xl cursor-pointer border-b border-neutral-600 hover:bg-neutral-800 transition-all ease-in-out duration-500 text-white"
            >
              Log Out
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}