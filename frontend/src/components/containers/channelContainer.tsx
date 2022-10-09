import { ReactNode, useState } from "react";

export default function ChannelContainer({
  children,
  position,
  classes,
}: {
  children: ReactNode;
  position: "left" | "right";
  classes?: string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <>
      {position === "right" && (
        <>
          {open && (
            <div
              onClick={() => setOpen(false)}
              className="w-[40px] h-[40px] bg-neutral-700 flex justify-center items-center self-end cursor-pointer z-1"
            >
              <i className="fa-solid fa-chevron-right"></i>
            </div>
          )}
          {!open && (
            <div
              onClick={() => setOpen(true)}
              className="w-[40px] h-[40px] bg-neutral-600 flex justify-center items-center self-end cursor-pointer z-1"
            >
              <i className="fa-solid fa-chevron-left"></i>
            </div>
          )}
        </>
      )}
      <div
        className={`${
          !open ? "w-0 min-w-0" : "min-w-[200px] max-w-[300px] w-[40%]"
        } relative z-0 h-full bg-neutral-700 overflow-hidden overflow-y-auto transition-all ease-in-out duration-500 ${classes}`}
      >
        {children}
      </div>
      {position === "left" && (
        <>
          {open && (
            <div
              onClick={() => setOpen(false)}
              className="w-[40px] h-[40px] bg-neutral-700 flex justify-center items-center self-end cursor-pointer z-1"
            >
              {position === "left" ? (
                <i className="fa-solid fa-chevron-left"></i>
              ) : (
                <i className="fa-solid fa-chevron-right"></i>
              )}
            </div>
          )}
          {!open && (
            <div
              onClick={() => setOpen(true)}
              className="w-[40px] h-[40px] bg-neutral-600 flex justify-center items-center self-end cursor-pointer z-1"
            >
              {position === "left" ? (
                <i className="fa-solid fa-chevron-right"></i>
              ) : (
                <i className="fa-solid fa-chevron-left"></i>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
