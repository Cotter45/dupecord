import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../../context/modal/modal";
import { Server } from "../../../redux/api/api.types";
import CreateServer from "./createServer";
import SearchServer from "./searchServer";

export default function Servers({
  servers,
  selectedServer,
  setSelectedServer,
}: {
  servers: Server[];
  selectedServer?: Server;
  setSelectedServer: (server: Server | undefined) => void;
}) {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [mouseOver, setMouseOver] = useState(0);

  return (
    <div className="w-full max-w-[80px] min-w-[80px] h-full flex flex-col gap-2 items-center overflow-hidden overflow-y-auto pb-10 bg-neutral-800 border-r border-neutral-400">
      <div
        title="Create a new Server."
        onClick={() => {
          setSelectedServer(undefined);
          navigate("/dupecord");
        }}
        className={`w-full py-2 flex items-center justify-center text-xl cursor-pointer shadow-sm hover:scale-110 transform transition-all duration-200 ${
          !selectedServer ? "shadow-yellow-400" : "shadow-neutral-400"
        }`}
      >
        <i className="fa-solid fa-house"></i>
      </div>
      <div
        title="Create a new Server."
        onClick={() => {
          setShowModal(true);
          setModalContent("createServer");
        }}
        className="w-[100%] py-2 flex items-center justify-center text-xl cursor-pointer shadow-sm shadow-neutral-400 hover:scale-110 transform transition-all duration-200"
      >
        <i className="fa-solid fa-plus"></i>
      </div>
      <div
        title="Search for a Server."
        onClick={() => {
          setShowModal(true);
          setModalContent("search");
        }}
        className="w-[100%] py-2 flex items-center justify-center text-xl cursor-pointer shadow-sm shadow-neutral-400  hover:scale-110 transform transition-all duration-200"
      >
        <i className="fa-solid fa-search"></i>
      </div>
      {servers.map((server) => (
        <div key={server.id} className="w-full flex justify-between items-center">
          <div className={`${mouseOver === server.id || selectedServer?.id === server.id ? 'bg-neutral-100': 'bg-none'} h-4 w-4 -translate-x-3 rounded-sm transition-all ease-in-out duration-300`}></div>
          <img
            title={server.name}
            onClick={(e) => setSelectedServer(server)}
            className={`fade_in w-[80%] max-w-[60px] aspect-square rounded-full p-2 cursor-pointer shadow-sm hover:rounded-lg -translate-x-2 transform transition-all ease-in-out duration-200 ${
              selectedServer?.id === server.id
                ? "shadow-yellow-400 rounded-none"
                : "shadow-neutral-400"
            }`}
            onMouseEnter={() => setMouseOver(server.id)}
            onMouseLeave={() => setMouseOver(0)}
            key={server.id}
            src={server.icon}
            alt={server.name}
          />
        </div>
      ))}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          {modalContent === "createServer" && (
            <CreateServer
              setSelectedServer={setSelectedServer}
              setShowModal={setShowModal}
            />
          )}
          {modalContent === "search" && (
            <SearchServer
              setSelectedServer={setSelectedServer}
              setShowModal={setShowModal}
            />
          )}
        </Modal>
      )}
    </div>
  );
}