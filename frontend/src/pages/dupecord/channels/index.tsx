import { useEffect, useState } from "react";
import { Modal } from "../../../context/modal/modal";
import { deleteServer } from "../../../redux/api";
import type { Category, Server } from "../../../redux/api/api.types";
import { useAppDispatch } from "../../../redux/hooks";
import EditServer from "../servers/editServer";

export default function Channels({
  isAdmin,
  selectedServer,
  setSelectedServer,
}: {
  isAdmin: boolean;
  selectedServer: Server;
  setSelectedServer: (server: Server | undefined) => void;
}) {
  const dispatch = useAppDispatch();

  const [categories, setCategories] = useState<Category[]>([]);
  const [viewOptions, setViewOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setmodalContent] = useState("");

  useEffect(() => {
    setCategories(selectedServer.channels.map((channel) => channel.category));
  }, [selectedServer]);

  return (
    <div className="fade_in w-full h-full flex flex-col gap-10">
      <div className="w-full flex flex-col gap-1">
        <h2 className="w-full text-2xl truncate border-b border-neutral-400">
          {selectedServer.name}
        </h2>
        {isAdmin && (
          <div
            onClick={() => setViewOptions(!viewOptions)}
            className="w-full text-left text-xs md:text-sm hover:text-teal-600 cursor-pointer transition-all ease-in-out duration-300 border-b border-neutral-400"
          >
            Admin Options
            {viewOptions ? (
              <i className="fas fa-chevron-up float-right"></i>
            ) : (
              <i className="fas fa-chevron-down float-right"></i>
            )}
          </div>
        )}
        <div
          className={`max-h-0 ${
            viewOptions ? "max-h-[100vh]" : "max-h-0"
          } overflow-hidden transition-all ease-in-out duration-300`}
        >
          {viewOptions && (
            <div className="fade_in w-full flex flex-col gap-2 py-2 text-xs md:text-sm">
              <div
                onClick={() => {
                  setShowModal(true);
                  setmodalContent("editServer");
                }}
                className="w-full text-right hover:text-cyan-400  cursor-pointer rounded-md transition-all ease-in-out duration-300"
              >
                Edit Server
                <i className="fa-solid fa-pen pl-2"></i>
              </div>
              <div
                onClick={() => {
                  setShowModal(true);
                  setmodalContent("deleteServer");
                }}
                className="w-full text-right hover:text-red-500  cursor-pointer rounded-md transition-all ease-in-out duration-300"
              >
                Delete Server
                <i className="fa-solid fa-trash pl-2"></i>
              </div>
              <div className="w-full text-right hover:text-teal-600  cursor-pointer rounded-md transition-all ease-in-out duration-300">
                Create Category
                <i className="fa-solid fa-plus pl-2"></i>
              </div>
              <div className="w-full text-right hover:text-cyan-400  cursor-pointer rounded-md transition-all ease-in-out duration-300">
                Edit Category
                <i className="fa-solid fa-pen pl-2"></i>
              </div>
              <div className="w-full text-right hover:text-teal-600  cursor-pointer rounded-md transition-all ease-in-out duration-300">
                Create Channel
                <i className="fa-solid fa-plus pl-2"></i>
              </div>
              <div className="w-full text-right hover:text-red-500  cursor-pointer rounded-md transition-all ease-in-out duration-300">
                Delete Channel
                <i className="fa-solid fa-trash pl-2"></i>
              </div>
            </div>
          )}
        </div>
      </div>
      {categories.length > 0 &&
        categories.map((category) => (
          <div key={category.id} className="w-full flex flex-col gap-2">
            <h3 className="w-full truncate border-b border-neutral-400 text-sm md:text-lg">
              # {category.name}
            </h3>
            {selectedServer.channels
              .filter((channel) => channel.category === category)
              .map((channel) => (
                <div
                  className="w-full p-1 cursor-pointer border-b border-neutral-500 transform transition-all duration-300 text-sm hover:bg-neutral-800 rounded-md hover:text-teal-600"
                  key={channel.id}
                >
                  {channel.name}
                </div>
              ))}
          </div>
        ))}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          {modalContent === "editServer" && (
            <EditServer
              selectedServer={selectedServer}
              setSelectedServer={setSelectedServer}
              setShowModal={setShowModal}
            />
          )}
          {modalContent === "deleteServer" && (
            <div className="w-full flex flex-col gap-2 bg-neutral-800 p-6 rounded-md">
              <h2 className="w-full text-2xl text-center">Delete Server</h2>
              <p className="w-full text-center">
                Are you sure you want to delete this server?
              </p>
              <div className="w-full flex flex-row gap-2">
                <button
                  onClick={() => {
                    dispatch(deleteServer(selectedServer.id));
                    setSelectedServer(undefined);
                  }}
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
          )}
        </Modal>
      )}
    </div>
  );
}