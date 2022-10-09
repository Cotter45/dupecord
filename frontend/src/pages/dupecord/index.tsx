import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ChannelContainer from "../../components/containers/channelContainer";
import { deafenOrUndeafen, getServers, muteOrUnmute } from "../../redux/api";
import { Server } from "../../redux/api/api.types";
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import Channels from "./channels";
import Servers from "./servers";
import DupeNav from "../../components/nav/dupeNav";

export default function DupeCord() {
  const dispatch = useAppDispatch();

  const servers = useAppSelector((state) => state.api.servers);
  const user = useAppSelector((state) => state.session.user);

  const [loaded, setLoaded] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedTab, setSelectedTab] = useState("friends");

  useEffect(() => {
    if (loaded) return;
    if (servers.length) return;

    dispatch(getServers());
    setLoaded(true);
  }, [servers, loaded, dispatch]);

  useEffect(() => {
    if (!selectedServer) return;

    if (selectedServer.ownerId === user?.id) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [selectedServer, user]);

  useEffect(() => {
    if (!selectedServer) return;
    const selected = servers.find((server) => server.id === selectedServer?.id);
    setSelectedServer(selected);
  }, [servers, selectedServer]);

  useEffect(() => {
    window.scrollTo(0, 1);
  }, []);

  return (
    <div className="fade_in w-full h-full flex relative">
      <Servers
        servers={servers}
        selectedServer={selectedServer}
        setSelectedServer={setSelectedServer}
      />
      {selectedServer ? (
        <ChannelContainer position={"left"} classes="fade_in">
          <Channels
            isAdmin={isAdmin}
            selectedServer={selectedServer}
            setSelectedServer={setSelectedServer}
          />
        </ChannelContainer>
      ) : (
        <ChannelContainer position={"left"} classes="fade_in">
          <div className="w-full h-[calc(100%-40px)] flex flex-col justify-center items-center overflow-hidden overflow-y-auto">
          my stuff
          </div>
          <DupeNav />
        </ChannelContainer>
      )}
      <div className="w-full h-full bg-neutral-800 overflow-x-hidden">
        <Outlet />
      </div>
      <ChannelContainer position={"right"}>
        <div className="w-full h-full bg-neutral-700">
          <div className="relative w-full flex justify-evenly items-center p-2">
            <div
              className={`${
                selectedTab === "friends" ? "text-teal-400" : ""
              } relative cursor-pointer transition-all ease-in-out duration-300`}
              onClick={() => setSelectedTab("friends")}
            >
              Friends
              {selectedTab === "friends" && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-violet-600"
                ></motion.div>
              )}
            </div>
            <div
              className={`${
                selectedTab === "requests" ? "text-teal-400" : ""
              } relative cursor-pointer transition-all ease-in-out duration-300`}
              onClick={() => setSelectedTab("requests")}
            >
              Requests
              {selectedTab === "requests" && (
                <motion.div
                  layoutId="underline"
                  className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-violet-600"
                ></motion.div>
              )}
            </div>
          </div>
        </div>
      </ChannelContainer>
    </div>
  );
}