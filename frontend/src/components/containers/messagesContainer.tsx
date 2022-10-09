import { ReactNode } from "react";

export default function MessagesContainer({ children }: { children: ReactNode }) {
  return (
    <div
      id="messages-container"
      style={{ borderRadius: "0 0 5px 5px" }}
      className="fade_in w-[calc(100%+8px)] h-full overflow-hidden overflow-y-auto flex flex-col-reverse py-4 "
    >
      {children}
    </div>
  );
}