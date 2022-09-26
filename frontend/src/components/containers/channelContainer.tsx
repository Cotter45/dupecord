import type { ReactNode } from "react";

export default function ChannelContainer({ children, classes }: { children: ReactNode; classes?: string }) {
  return (
    <div className={`w-[30%] max-w-[300px] h-full bg-neutral-700 overflow-y-auto ${classes}`}>
      {children}
    </div>
  );
}
