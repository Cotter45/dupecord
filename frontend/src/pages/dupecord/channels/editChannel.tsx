import { FormEvent, useState } from "react";
import { useAppDispatch } from "../../../redux/hooks";
import type { Channel, Category, Server } from "../../../redux/api/api.types";
import { editChannel } from "../../../redux/api";

export default function EditChannel({ 
  channel, 
  categories, 
  selectedServer, 
  setSelectedServer, 
  setShowModal 
}: { 
  channel: Channel; 
  categories: Category[]; 
  selectedServer: Server; 
  setSelectedServer: (server: Server | undefined) => void; 
  setShowModal: (show: boolean) => void; 
}) {
    const dispatch = useAppDispatch(); 
    
    const [name, setName] = useState(channel.name); 
    const [nameFocused, setNameFocused] = useState(false); 
    const [categoryId, setCategoryId] = useState(channel.categoryId);
    const [error, setError] = useState("");

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (!name || !selectedServer.id) {
        setError("Please enter a name for your channel.");
        return;
      }
      const res: any = await dispatch(editChannel({ name, categoryId: categoryId, id: channel.id, serverId: selectedServer.id }));
      if (res) {
        setSelectedServer(res.payload);
        setShowModal(false);
      }
    };

    return (
       <div className="w-full max-w-[80vw] h-full max-h-[80vh] flex flex-col justify-center items-center bg-neutral-800 text-white p-4 rounded-md">
      <h2 className="text-2xl text-left w-full max-w-[600px]">
        Edit your channel
      </h2>
      <p className="text-gray-400 max-w-[600px]">
        It's easy, lickety split.
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
          Channel Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onMouseEnter={() => setNameFocused(true)}
          onMouseLeave={() => setNameFocused(false)}
          className="w-full p-2 rounded-md border border-neutral-400"
        />
        {error && <p className="text-red-500">{error}</p>}
        <label className="required self-start" htmlFor="category">
          Category
        </label>
        {categories.map((category) => (
          <button 
            key={category.id}
            type="button"
            name="category"
            value={category.id}
            onClick={() => setCategoryId(category.id)}
            className={`w-full p-2 rounded-md border border-neutral-400 bg-transparent hover:bg-neutral-700 transition-all ease-in-out duration-500 ${
              categoryId === category.id && "bg-neutral-500"
            }`}
          >
            {category.name}
          </button>
        ))}
        <button
          type="submit"
          className="w-full p-2 rounded-md mt-4 border border-neutral-400"
        >
          Edit
        </button>
      </form>
    </div>
  );
}