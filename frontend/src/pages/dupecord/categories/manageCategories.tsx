import { deleteCategory, editCategory } from "../../../redux/api";
import type { Category, Server } from "../../../redux/api/api.types";
import { useAppDispatch } from "../../../redux/hooks";
import EditCategory from "./editCategory";

export default function ManageCategories({
  categories,
  setCategories,
  setSelectedServer,
  setShowModal,
}: {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  setSelectedServer: (server: Server | undefined) => void;
  setShowModal: (show: boolean) => void;
}) {
  const dispatch = useAppDispatch();

  return (
    <div className="w-full max-w-[80vw] h-full max-h-[80vh] overflow-y-auto flex flex-col justify-start items-center gap-4 bg-neutral-800 text-white p-4 rounded-md">
      <h2 className="text-2xl text-left w-full max-w-[600px]">
        Your categories
      </h2>
      <p className="text-gray-400 max-w-[600px]">
        Here you can manage your categories. Just change the name or delete them. You're the boss.
      </p>
      <div className="w-full max-w-[600px] flex flex-col gap-2">
        {categories.map((category) => (
          <div key={category.id} className="w-full flex flex-col gap-2">
            <EditCategory
              category={category}
              setCategories={setCategories}
              setSelectedServer={setSelectedServer}
            />
            <button
              className="w-[30%] min-w-[200px] bg-red-500 text-white rounded-md p-2 self-end"
              onClick={async () => {
                const res = await dispatch(deleteCategory({ id: category.id, serverId: category.serverId }));
                if (res) {
                  setSelectedServer(res.payload);
                  setCategories(res.payload.categories);
                }
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button
        className="w-full max-w-[600px] bg-neutral-700 text-white rounded-md p-2"
        onClick={() => {
          setShowModal(false);
        }}
      >
        Close
      </button>
    </div>
  );
}