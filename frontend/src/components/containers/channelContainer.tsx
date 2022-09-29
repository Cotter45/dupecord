import { ReactNode, useState } from "react";

export default function ChannelContainer({
  children,
  classes,
}: {
  children: ReactNode;
  classes?: string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <>
      <div
        className={`${
          !open ? "w-0 min-w-0" : "min-w-[200px] max-w-[300px] w-[40%]"
        } relative z-0 h-full bg-neutral-700 overflow-y-auto transition-all ease-in-out duration-500 ${classes}`}
      >
        {open && children}
      </div>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ borderRadius: "0 5px 0 0" }}
          className="w-8 h-[40px] bg-neutral-700 flex justify-center items-center self-end cursor-pointer z-1"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </div>
      )}
      {!open && (
        <div
          onClick={() => setOpen(true)}
          style={{ borderRadius: "0 5px 0 0" }}
          className="w-8 h-[40px] bg-neutral-600 flex justify-center items-center self-end cursor-pointer z-1"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </div>
      )}
    </>
  );
}
