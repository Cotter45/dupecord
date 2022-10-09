import { useEffect, useState } from "react";
import { NavLink, useLocation, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { Modal } from "../../../context/modal/modal";
import type { Category, Channel, Server } from "../../../redux/api/api.types";
import CreateCategory from "../categories/createCategory";
import ManageCategories from "../categories/manageCategories";
import DeleteServer from "../servers/deleteServer";
import EditServer from "../servers/editServer";
import ChannelAdmin from "./channelAdmin";
import CreateChannel from "./createChannel";
import DeleteChannel from "./deleteChannel";
import EditChannel from "./editChannel";
import DupeNav from "../../../components/nav/dupeNav";

export default function Channels({
  isAdmin,
  selectedServer,
  setSelectedServer,
}: {
  isAdmin: boolean;
  selectedServer: Server;
  setSelectedServer: (server: Server | undefined) => void;
}) {
  const params: { id?: number } = useParams();

  const [categories, setCategories] = useState<Category[]>();
  const [viewOptions, setViewOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setmodalContent] = useState("");
  const [channel, setChannel] = useState<Channel>();
  const [categoryId, setCategoryId] = useState(0);
  const [channelHover, setChannelHover] = useState(0);

  useEffect(() => {
    setCategories(selectedServer.categories);
  }, [selectedServer]);

  return (
    <div className="fade_in w-full h-full flex flex-col justify-between gap-10">
      <ChannelAdmin
        selectedServer={selectedServer}
        isAdmin={isAdmin}
        viewOptions={viewOptions}
        setViewOptions={setViewOptions}
        setShowModal={setShowModal}
        setmodalContent={setmodalContent}
      />
      {categories &&
        categories.length > 0 &&
        categories.map((category) => (
          <div key={category.id} className="w-full flex flex-col gap-2">
            <div className="w-full flex justify-between items-center border-b border-neutral-400 px-2">
              <h3 className="w-full truncate text-sm md:text-lg">
                # {category.name}
              </h3>
              {isAdmin && (
                <i
                  onClick={() => {
                    setShowModal(true);
                    setCategoryId(category.id);
                    setmodalContent("createChannel");
                  }}
                  className="fa-solid fa-plus cursor-pointer text-neutral-400 hover:text-white transition-all ease-in-out duration-300"
                ></i>
              )}
            </div>
            {selectedServer.channels
              .filter((channel) => channel.category.id === category.id)
              .map((channel) => (
                <NavLink
                  to={`/dupecord/${channel.id}`}
                  onMouseEnter={() => setChannelHover(channel.id)}
                  onMouseLeave={() => setChannelHover(0)}
                  className={`relative w-[90%] self-end p-1 cursor-pointer transform transition-all duration-300 text-sm 0 flex justify-between items-center  text-neutral-200 hover:text-teal-400 ${
                    params.id && +params.id === channel.id && "text-teal-400"
                  }`}
                  key={channel.id}
                >
                  <label className="px-2 truncate cursor-pointer">
                    {channel.name}
                  </label>
                  {params.id && +params.id === channel.id && (
                    <motion.div
                      layoutId="channel-underline"
                      className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-violet-600"
                    ></motion.div>
                  )}
                  {isAdmin && channelHover === channel.id && (
                    <div className="flex flex-row gap-2 px-2 text-neutral-200">
                      <i
                        onClick={() => {
                          setChannel(channel);
                          setShowModal(true);
                          setmodalContent("editChannel");
                        }}
                        className="fa-solid fa-edit cursor-pointer hover:text-orange-400 transition-all ease-in-out duration-300"
                      ></i>
                      <i
                        onClick={() => {
                          setChannel(channel);
                          setShowModal(true);
                          setmodalContent("deleteChannel");
                        }}
                        className="fa-solid fa-trash hover:text-red-700 transition-all ease-in-out duration-300"
                      ></i>
                    </div>
                  )}
                </NavLink>
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
            <DeleteServer
              selectedServer={selectedServer}
              setSelectedServer={setSelectedServer}
              setShowModal={setShowModal}
            />
          )}
          {modalContent === "createCategory" && (
            <CreateCategory
              setCategories={setCategories}
              selectedServer={selectedServer}
              setSelectedServer={setSelectedServer}
              setShowModal={setShowModal}
            />
          )}
          {modalContent === "manageCategories" && categories && (
            <ManageCategories
              categories={categories}
              setCategories={setCategories}
              setSelectedServer={setSelectedServer}
              setShowModal={setShowModal}
            />
          )}
          {modalContent === "createChannel" && (
            <CreateChannel
              categoryId={categoryId}
              selectedServer={selectedServer}
              setSelectedServer={setSelectedServer}
              setShowModal={setShowModal}
            />
          )}
          {modalContent === "editChannel" && channel && categories && (
            <EditChannel
              channel={channel}
              categories={categories}
              selectedServer={selectedServer}
              setSelectedServer={setSelectedServer}
              setShowModal={setShowModal}
            />
          )}
          {modalContent === "deleteChannel" && channel && (
            <DeleteChannel
              channel={channel}
              setSelectedServer={setSelectedServer}
              setShowModal={setShowModal}
            />
          )}
        </Modal>
      )}
      <DupeNav />
    </div>
  );
}