import { useSocket } from "../../../context/ws";
import { deleteChannel } from "../../../redux/api";
import type { Channel, Server } from "../../../redux/api/api.types";
import { useAppDispatch } from "../../../redux/hooks";

export default function DeleteChannel({
  channel,
  setSelectedServer,
  setShowModal,
}: {
  channel: Channel;
  setSelectedServer: (server: Server | undefined) => void;
  setShowModal: (show: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  const socket = useSocket();

  const handleDelete = async () => {
    const res = await dispatch(
      deleteChannel({ id: channel.id, serverId: channel.serverId })
    );
    setSelectedServer(res.payload);
    if (socket && socket.current !== null) {
      socket.current.emit("message", {
        type: "replace-server",
        data: { server: res.payload },
      });
    }
    setShowModal(false);
  }
  return (
    <div className="w-full flex flex-col gap-2 bg-neutral-800 p-6 rounded-md max-w-[700px]">
      <h2 className="w-full text-2xl text-center">
        Delete Channel # {channel.name}
      </h2>
      <p className="w-full text-center">
        Are you sure you want to delete this Channel?
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
  );
}