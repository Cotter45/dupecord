import { useState } from "react";
import { editCategory } from "../../../redux/api";
import type { Category, Server } from "../../../redux/api/api.types";
import { useAppDispatch } from "../../../redux/hooks";

export default function EditCategory({
  category,
  setCategories,
  setSelectedServer,
}: {
  category: Category;
  setCategories: (categories: Category[]) => void;
  setSelectedServer: (server: Server | undefined) => void;
}) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState(category.name);

  return (
    <>
      <label
        className="required self-start transition-all ease-in-out duration-500"
        htmlFor="name"
      >
        Category Name
      </label>
      <input
        type="text"
        name="name"
        id="name"
        className="w-full bg-neutral-700 text-white rounded-md p-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={async (e) => {
          const res = await dispatch(
            editCategory({ name, id: category.id, serverId: category.serverId })
          );
          if (res) {
            setSelectedServer(res.payload);
            setCategories(res.payload.categories);
          }
        }}
      />
    </>
  );
}