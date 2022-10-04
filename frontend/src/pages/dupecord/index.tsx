import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import ChannelContainer from "../../components/containers/channelContainer";
import { getServers } from "../../redux/api";
import { Server } from "../../redux/api/api.types";
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import Channels from "./channels";
import Servers from "./servers";

export default function DupeCord() {
  const dispatch = useAppDispatch();

  const servers = useAppSelector((state) => state.api.servers);
  const user = useAppSelector((state) => state.session.user);

  const [loaded, setLoaded] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server>();
  const [isAdmin, setIsAdmin] = useState(false);

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

  return (
    <div className="fade_in w-full h-full flex relative">
      <Servers
        servers={servers}
        selectedServer={selectedServer}
        setSelectedServer={setSelectedServer}
      />
      {selectedServer ? (
        <ChannelContainer position={'left'}>
          <Channels
            isAdmin={isAdmin}
            selectedServer={selectedServer}
            setSelectedServer={setSelectedServer}
          />
        </ChannelContainer>
      ) : (
        <ChannelContainer position={'left'}>my stuff</ChannelContainer>
      )}
      <div className="w-full h-full bg-neutral-800">
        <Outlet />
      </div>
      <ChannelContainer position={'right'}>
        <div className="w-full h-full bg-neutral-700"></div>
      </ChannelContainer>
    </div>
  );
}