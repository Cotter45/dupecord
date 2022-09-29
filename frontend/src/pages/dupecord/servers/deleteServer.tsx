import { useNavigate } from "react-router-dom";
import { deleteServer } from "../../../redux/api";
import type { Server } from "../../../redux/api/api.types";
import { useAppDispatch } from "../../../redux/hooks";

export default function DeleteServer({
  selectedServer,
  setSelectedServer,
  setShowModal,
}: {
  selectedServer: Server;
  setSelectedServer: (server: Server | undefined) => void;
  setShowModal: (show: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="w-full flex flex-col gap-2 bg-neutral-800 p-6 rounded-md max-w-[700px]">
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
  );
}