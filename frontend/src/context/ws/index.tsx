import React, {
  createContext,
  MutableRefObject,
  useContext,
  useRef,
} from "react";
import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket as IOSocket } from "socket.io-client";
import { replaceServer, addChannelMessage, removeServer, replaceMessage } from "../../redux/api";

import {
  useAppDispatch,
  useAppSelector,
} from "../../redux/hooks";

export const SocketContext =
  createContext<React.MutableRefObject<IOSocket | null> | null>(null);
export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

function SocketProvider({ children }: SocketProviderProps) {
  const user = useAppSelector((state) => state.session.user);
  const navigate = useNavigate();

  const socket = useRef<IOSocket | null>(null);
  const dispatch = useAppDispatch();

  function connect(socket: MutableRefObject<IOSocket | null>) {
    if (!user) return;
    if (!user.email) return;
    if (socket.current) return;

    let websocket = io(
      import.meta.env.MODE === "development"
        ? "http://localhost:8000" : window.location.origin,
      {
        path: "/socket.io",
        reconnectionDelay: 1000,
        reconnection: true,
        transports: ["websocket"],
        // agent: false,
        upgrade: true,
        rejectUnauthorized: false,
        withCredentials: true,
      }
    );
    websocket.emit('message', {
      type: 'login',
      data: user.id,
    })

    websocket.on('connection', (e) => {
      console.log("Socket Open");
      // socket.current = websocket;
    });

    websocket.on('error', async (e) => {
      if (import.meta.env.NODE_ENV !== "production") {
        console.error(e);
      }
      // TO DO create notification window to reconnect
      // await dispatch(logout())
      navigate("/");
    });

    websocket.on('disconnect', async (e) => {
      console.log("Socket Close");
      if (socket.current && typeof socket.current !== "function") {
        socket.current.close();
        socket.current = null;
      }
      // TO DO create notification window to reconnect
      // await dispatch(logout())
      const notification = {
        type: "websocket-disconnect",
        id: 999999999999999,
      };
      // dispatch(setNotification(notification));
      navigate("/");
    });

    websocket.on('message', async (message) => {
      console.log(message);

      switch (message.type) {
        case "replace-server":
          dispatch(replaceServer(message.data));
          break;
        case "channel-message":
          dispatch(addChannelMessage(message.data.message));
          break;
        case "delete-server":
          console.log("delete server", message.data);
          dispatch(removeServer(message.data));
          break;
        case "replace-message":
          console.log("like message", message.data);
          dispatch(replaceMessage(message.data));
          break;
        case "notification":
          if (localStorage.getItem("notificationSounds") === "true") {
            const notificationAudio = new Audio(
              "http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3"
            );
            notificationAudio.play();
          }
          // dispatch(setNotification(payload));
          return;
        case "online":
          console.log("online");
          // dispatch(setOnline(payload));
          return;
        case "offline":
          // dispatch(setOffline(payload));
          return;
        case "accept-chat":
          // dispatch(acceptChat(payload));
          return;
        case "decline-chat":
          // dispatch(setNotification(payload));
          return;
        case "new-message":
          if (
            localStorage.getItem("messageSounds") === "true" &&
            message.to.id === user.id
          ) {
            const messageAudio = new Audio(
              "http://commondatastorage.googleapis.com/codeskulptor-assets/week7-brrring.m4a"
            );
            messageAudio.play();
          }
          // dispatch(addMessage(payload));
          return;
        default:
          return;
      }
    });

    socket.current = websocket;
  }

  useLayoutEffect(() => {
    if (!user) return;
    if (!user.email) return;
    if (socket.current) return;

    connect(socket);

    return () => {
      if (socket.current) {
        socket.current.close();
        socket.current = null;
      }
    };
  }, [user, dispatch]);

  // socket.reconnect = connect;

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export default SocketProvider;
