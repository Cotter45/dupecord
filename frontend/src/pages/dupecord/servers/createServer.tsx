import { FormEvent, useState } from "react";
import { createServer } from "../../../redux/api";
import { Server } from "../../../redux/api/api.types";
import { useAppDispatch } from "../../../redux/hooks";

export default function CreateServer({
  setSelectedServer,
  setShowModal,
}: {
  setSelectedServer: (server: Server) => void;
  setShowModal: (show: boolean) => void;
}) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [icon, setIcon] = useState("");
  const [iconFocused, setIconFocused] = useState(false);
  const [privateServer, setPrivate] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await dispatch(createServer({ name, icon, private: privateServer }));
    if (res.meta.requestStatus === "rejected") {
      setError(res.payload.message);
      return;
    }
    setSelectedServer(res.payload);
    setShowModal(false);
  };

  return (
    <div className="w-full max-w-[80vw] h-full max-h-[80vh] flex flex-col justify-center items-center bg-neutral-800 text-white p-4 rounded-md">
      <h2 className="text-2xl text-left w-full max-w-[600px]">
        Create a new server
      </h2>
      <p className="text-gray-400 max-w-[600px]">
        It's easy, all you need to get started is a name and an optional icon.
      </p>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[600px] flex flex-col gap-2"
      >
        <label
          className={`required self-start translate-y-12 translate-x-6 transition-all ease-in-out duration-500 ${
            (nameFocused || name.length) && "translate-y-2 -translate-x-2"
          }`}
          htmlFor="name"
          onMouseEnter={() => setNameFocused(true)}
        >
          Server Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onMouseEnter={() => setNameFocused(true)}
          onMouseLeave={() => setNameFocused(false)}
          className="w-full p-2 rounded-md border border-neutral-400"
        />
        {error && <p className="text-red-500">{error}</p>}
        <label
          className={`required self-start translate-y-12 translate-x-6 transition-all ease-in-out duration-500 ${
            (iconFocused || icon.length) && "translate-y-2 -translate-x-2"
          }`}
          htmlFor="icon"
          onMouseEnter={() => setIconFocused(true)}
        >
          Server Icon
        </label>
        <input
          type="text"
          name="icon"
          id="icon"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          onMouseEnter={() => setIconFocused(true)}
          onMouseLeave={() => setIconFocused(false)}
          className="w-full p-2 rounded-md border border-neutral-400"
        />
        <div className="w-full flex items-center justify-end gap-2">
          <input
            type="checkbox"
            name="private"
            id="private"
            checked={privateServer}
            onChange={(e) => setPrivate(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="private">Private</label>
        </div>
        <button
          type="submit"
          className="w-full p-2 rounded-md mt-4 border border-neutral-400"
        >
          Create
        </button>
      </form>
    </div>
  );
}