import { useEffect, useRef, useState } from "react";

interface Props {
  email: string;
  stream: MediaStream;
  muted?: boolean;
}

export default function VideoContainer ({ email, stream, muted }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
    if (muted) setIsMuted(muted);
  }, [stream, muted]);

  return (
    <div className="flex flex-col items-center rounded">
      <video
        className="min-w-[200px] aspect-square rounded"
        ref={ref}
        muted={isMuted}
        autoPlay
      />
      <div>{email}</div>
    </div>
  );
};
