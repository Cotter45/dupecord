import React, { useState, useRef, useEffect, useCallback } from "react";
import io from "socket.io-client";
import VideoContainer from "../../../components/containers/videoContainer";
import { useSocket } from "../../../context/ws";
import { useAppSelector } from "../../../redux/hooks";

type WebRTCUser = {
	id: string;
	email: string;
	stream: MediaStream;
}

const pc_config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export default function VideoChat() {
  // const socketRef = useSocket();
  const socketRef = useRef<any | null>(null);
  const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({});
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream>();

  const [users, setUsers] = useState<any[]>([]);
  const user = useAppSelector((state) => state.session.user);
  const currentChannel = useAppSelector((state) => state.api.currentChannel);

  const getLocalStream = useCallback(async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 240,
          height: 240,
        },
      });
      localStreamRef.current = localStream;
      if (localVideoRef.current) localVideoRef.current.srcObject = localStream;
      if (!socketRef || !socketRef.current) return;
      socketRef.current.emit("join_room", {
        room: currentChannel?.id,
        email: user?.username,
      });
    } catch (e) {
      // console.log(`getUserMedia error: ${e}`);
    }
  }, []);

  const createPeerConnection = useCallback(
    (socketID: string, email: string) => {
      try {
        const pc = new RTCPeerConnection(pc_config);

        pc.onicecandidate = (e) => {
          if (!socketRef || !socketRef.current || !e.candidate) return;
          socketRef.current.emit("candidate", {
            candidate: e.candidate,
            candidateSendID: socketRef.current.id,
            candidateReceiveID: socketID,
          });
        };

        pc.oniceconnectionstatechange = (e) => {
          // console.log(e);
        };

        pc.ontrack = (e) => {
          setUsers((oldUsers) =>
            oldUsers
              .filter((oldUser) => oldUser.id !== socketID)
              .concat({
                id: socketID,
                email,
                stream: e.streams[0],
              })
          );
        };

        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => {
            if (!localStreamRef.current) return;
            pc.addTrack(track, localStreamRef.current);
          });
        } else {
          // console.log("no local stream");
        }

        return pc;
      } catch (e) {
        console.error(e);
        return undefined;
      }
    },
    []
  );

  useEffect(() => {
    if (!user) return;

    let websocket = io(
      import.meta.env.MODE === "development"
        ? "http://localhost:8000"
        : window.location.origin,
      {
        path: "/socket.io",
        reconnectionDelay: 1000,
        reconnection: true,
        transports: ["websocket"],
        // agent: false,
        upgrade: true,
        rejectUnauthorized: false,
        withCredentials: true,
        auth: {
          token: user.token
        }
      }
    );

    socketRef.current = websocket;

    return () => {
      socketRef.current.disconnect();
    }
  }, []);

  useEffect(() => {
    getLocalStream();

    return () => {
      if (socketRef && socketRef.current) {
        socketRef.current.emit("user_exit", { id: socketRef.current.id });
      }
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
      for (const pc in pcsRef.current) {
        console.log(pc);
        pcsRef.current[pc].close();
      }
    }
  }, []);

  useEffect(() => {
    if (!socketRef || !socketRef.current) return;

    socketRef.current.on(
      "all_users",
      async (allUsers: Array<{ id: string; email: string }>) => {
        for (const pcUser of allUsers) {
          if (!localStreamRef.current) return;
          const pc = createPeerConnection(pcUser.id, pcUser.email);
          if (!(pc && socketRef.current)) return;
          pcsRef.current = { ...pcsRef.current, [pcUser.id]: pc };
          try {
            const localSdp = await pc.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            });
            await pc.setLocalDescription(new RTCSessionDescription(localSdp));
            socketRef.current.emit("offer", {
              sdp: localSdp,
              offerSendID: socketRef.current.id,
              offerSendEmail: user?.username,
              offerReceiveID: pcUser.id,
            });
          } catch (e) {
            console.error(e);
          }
        };
      }
    );

    socketRef.current.on(
      "getOffer",
      async (data: {
        sdp: RTCSessionDescription;
        offerSendID: string;
        offerSendEmail: string;
      }) => {
        const { sdp, offerSendID, offerSendEmail } = data;
        if (!localStreamRef.current) return;
        const pc = createPeerConnection(offerSendID, offerSendEmail);
        if (!(pc && socketRef.current)) return;
        pcsRef.current = { ...pcsRef.current, [offerSendID]: pc };
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
          const localSdp = await pc.createAnswer({
            offerToReceiveVideo: true,
            offerToReceiveAudio: true,
          });
          await pc.setLocalDescription(new RTCSessionDescription(localSdp));
          socketRef.current.emit("answer", {
            sdp: localSdp,
            answerSendID: socketRef.current.id,
            answerReceiveID: offerSendID,
          });
        } catch (e) {
          console.error(e);
        }
      }
    );

    socketRef.current.on(
      "getAnswer",
      (data: { sdp: RTCSessionDescription; answerSendID: string }) => {
        const { sdp, answerSendID } = data;
        const pc: RTCPeerConnection = pcsRef.current[answerSendID];
        if (!pc) return;
        pc.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    );

    socketRef.current.on(
      "getCandidate",
      async (data: {
        candidate: RTCIceCandidateInit;
        candidateSendID: string;
      }) => {
        const pc: RTCPeerConnection = pcsRef.current[data.candidateSendID];
        if (!pc) return;
        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    );

    socketRef.current.on("user_exit", (data: { id: string }) => {
      if (!pcsRef.current[data.id]) return;
      pcsRef.current[data.id].close();
      delete pcsRef.current[data.id];
      setUsers((oldUsers) => oldUsers.filter((user) => user.id !== data.id));
    });

    return () => {
      for (const pc in pcsRef.current) {
        pcsRef.current[pc].close();
      }
      users.forEach((user) => {
        console.log('HERE')
        if (!pcsRef.current[user.id]) return;
        pcsRef.current[user.id].close();
        delete pcsRef.current[user.id];
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createPeerConnection, getLocalStream]);
  console.log(users);

  return (
    <div className="relative h-full w-full flex flex-row justify-start items-center gap-2 overflow-auto m-auto">
      <div className="flex flex-col items-center rounded">
        <video
          className="min-w-[200px] aspect-square rounded shadow-md shadow-gray-600"
          muted
          ref={localVideoRef}
          autoPlay
        />
        <div>{user?.username}</div>
      </div>

      {users.map((user, index) => (
        <VideoContainer key={index} email={user.email} stream={user.stream} />
      ))}
    </div>
  );
};
