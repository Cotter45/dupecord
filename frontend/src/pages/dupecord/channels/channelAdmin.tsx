import type { Server } from "../../../redux/api/api.types";

export default function ChannelAdmin({
  selectedServer,
  isAdmin,
  viewOptions,
  setViewOptions,
  setShowModal,
  setmodalContent,
}: {
  selectedServer: Server;
  isAdmin: boolean;
  viewOptions: boolean;
  setViewOptions: (viewOptions: boolean) => void;
  setShowModal: (showModal: boolean) => void;
  setmodalContent: (modalContent: string) => void;
}) {
  return (
    <div
      onClick={() => {
        isAdmin && setViewOptions(!viewOptions);
      }}
      className="sticky top-0 w-full flex flex-col gap-1 cursor-pointer transition-all ease-in-out duration-300 border-b border-neutral-400 p-2 bg-neutral-700 z-10"
    >
      <div className="w-full flex justify-between items-center">
        <h2 className="w-full text-2xl truncate">{selectedServer.name}</h2>
        {isAdmin && (
          <>
            {viewOptions ? (
              <i className="fas fa-chevron-up float-right"></i>
            ) : (
              <i className="fas fa-chevron-down float-right"></i>
            )}
          </>
        )}
      </div>
      <div
        className={`max-h-0 ${
          viewOptions ? "max-h-[100vh]" : "max-h-0"
        } overflow-hidden transition-all ease-in-out duration-300 rounded-md`}
      >
        {viewOptions && (
          <div className="absolute z-10 top-[60px] left-0 fade_in w-full flex flex-col items-center gap-2 py-2 text-sm bg-neutral-800">
            <div
              onClick={() => {
                setShowModal(true);
                setmodalContent("editServer");
              }}
              className="w-[80%] text-left hover:bg-violet-600 p-2 cursor-pointer rounded-md transition-all ease-in-out duration-300 flex justify-between items-center"
            >
              <label>Edit Server</label>
              <i className="fa-solid fa-pen pl-2"></i>
            </div>
            <div
              onClick={() => {
                setShowModal(true);
                setmodalContent("deleteServer");
              }}
              className="w-[80%] text-left hover:bg-violet-600 p-2  cursor-pointer rounded-md transition-all ease-in-out duration-300 flex justify-between items-center"
            >
              <label>Delete Server</label>
              <i className="fa-solid fa-trash pl-2"></i>
            </div>
            <div onClick={() => {
              setShowModal(true);
              setmodalContent("createCategory");
            }} className="w-[80%] hover:bg-violet-600 p-2  cursor-pointer rounded-md transition-all ease-in-out duration-300 flex justify-between items-center">
              <label>Create Category</label>
              <i className="fa-solid fa-plus pl-2"></i>
            </div>
            <div onClick={() => {
              setShowModal(true);
              setmodalContent("manageCategories");
            }} className="w-[80%] hover:bg-violet-600 p-2 cursor-pointer rounded-md transition-all ease-in-out duration-300 flex justify-between items-center">
              <label>Manage Categories</label>
              <i className="fa-solid fa-pen pl-2"></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}