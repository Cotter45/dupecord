import { useState } from "react";
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

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState("");
  return (
    <div className="w-[10%] max-w-[80px] h-full flex flex-col gap-2 items-center overflow-hidden overflow-y-auto pb-10 bg-neutral-800">
      <div
        title="Create a new Server."
        onClick={() => {
          setSelectedServer(undefined);
        }}
        className={`w-full py-2 flex items-center justify-center text-xl cursor-pointer shadow-sm  hover:scale-110 transform transition-all duration-200 ${
          !selectedServer ? "shadow-yellow-400" : "shadow-neutral-400"
        }`}
      >
        {/* 🏠 */}
        <i className="fa-solid fa-house"></i>
      </div>
      <div
        title="Create a new Server."
        onClick={() => {
          setShowModal(true);
          setModalContent("createServer");
        }}
        className="w-[100%] py-2 flex items-center justify-center text-xl cursor-pointer shadow-sm shadow-neutral-400  hover:scale-110 transform transition-all duration-200"
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
        <img
          title={server.name}
          onClick={(e) => setSelectedServer(server)}
          className={`w-[80%] max-w-[60px] aspect-square rounded-full p-2 cursor-pointer shadow-sm hover:scale-110 transform transition-all duration-200 ${
            selectedServer?.id === server.id
              ? "shadow-yellow-400 rounded-none"
              : "shadow-neutral-400"
          }`}
          key={server.id}
          src={server.icon}
          alt={server.name}
        />
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