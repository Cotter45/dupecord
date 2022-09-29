import { FormEvent, useState } from "react";
import { createCategory } from "../../../redux/api";
import { Category, Server } from "../../../redux/api/api.types";
import { useAppDispatch } from "../../../redux/hooks";

export default function CreateCategory({
  setShowModal,
  setCategories,
  selectedServer,
  setSelectedServer,
}: {
  selectedServer: Server;
  setCategories: (categories: Category[]) => void;
  setShowModal: (showModal: boolean) => void;
  setSelectedServer: (server: Server | undefined) => void;
}) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !selectedServer.id) {
      setError("Please enter a name for your channel.");
      return;
    }
    const res: any = await dispatch(createCategory({ name, serverId: +selectedServer.id }));
    if (res) {
      setSelectedServer(res.payload);
      setCategories(res.payload.categories);
      setShowModal(false);
    }
  };

  return (
       <div className="w-full max-w-[80vw] h-full max-h-[80vh] flex flex-col justify-center items-center bg-neutral-800 text-white p-4 rounded-md">
      <h2 className="text-2xl text-left w-full max-w-[600px]">
        Create a new category
      </h2>
      <p className="text-gray-400 max-w-[600px]">
        It's easy, all you need to get started is a name. Lickity splickity doo.
      </p>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[600px] flex flex-col gap-2"
      >
        <label
          className={`required self-start translate-y-10 translate-x-6 transition-all ease-in-out duration-500 ${
            (nameFocused || name.length) && "translate-y-0 -translate-x-2"
          }`}
          htmlFor="name"
          onMouseEnter={() => setNameFocused(true)}
        >
          Category Name
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