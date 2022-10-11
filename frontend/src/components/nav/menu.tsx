import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../../context/ws";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/session";

export default function NavMenu() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useSocket();

  const [isOpen, setIsOpen] = useState(false);

  const user = useAppSelector((state) => state.session.user);

  useEffect(() => {
    if (!isOpen) return;

    const body = document.querySelector("main");
    const handleClick = (e: MouseEvent) => {
      setIsOpen(!isOpen);
    };

    body && body.addEventListener("click", handleClick, { once: true });

    return () => {
      body && body.removeEventListener("click", handleClick);
    };
  }, [isOpen]);

  return (
    <>
      <input
        checked={isOpen}
        onChange={() => {}}
        type="checkbox"
        id="menu-toggle"
      />
      <label
        data-testid="menu_toggle"
        onClick={() => setIsOpen(!isOpen)}
        htmlFor="menu-toggle"
        className="hamburger"
      >
        <span className="bun bun-top">
          <span className="bun-crust bun-crust-top"></span>
        </span>
        <span className="bun bun-bottom">
          <span className="bun-crust bun-crust-bottom"></span>
        </span>
      </label>
      <section
        style={{
          maxWidth: isOpen ? "350px" : "0px",
        }}
        className="menu bg-neutral-800 flex flex-col gap-4 pb-10 border-l border-neutral-600"
      >
        <section className="flex flex-col justify-evenly">
          {!user ? (
            <>
              <div
                data-testid="menu_login_button"
                onClick={() => {
                  setIsOpen(!isOpen);
                  navigate("/signup");
                }}
                className="w-full h-14 flex justify-center items-center whitespace-nowrap text-xl cursor-pointer border-b border-neutral-600 hover:bg-neutral-700 transition-all ease-in-out duration-500 text-white"
              >
                Sign Up
              </div>
              <div
                data-testid="menu_login_button"
                onClick={() => {
                  setIsOpen(!isOpen);
                  navigate("/login");
                }}
                className="w-full h-14 flex justify-center items-center whitespace-nowrap text-xl cursor-pointer border-b border-neutral-600 hover:bg-neutral-700 transition-all ease-in-out duration-500 text-white"
              >
                Log In
              </div>
            </>
          ) : (
            <>
              {!location.pathname.includes("dupecord") && (
                <div
                  data-testid="menu_dupecord_button"
                  onClick={() => {
                    setIsOpen(!isOpen);
                    navigate("/dupecord");
                  }}
                  className="w-full h-14 flex justify-center items-center whitespace-nowrap text-xl cursor-pointer border-b border-neutral-600 hover:bg-neutral-700 transition-all ease-in-out duration-500 text-white"
                >
                  Dupecord
                </div>
              )}
              {location.pathname.includes("dupecord") && (
                <div
                  data-testid="menu_splash_button"
                  onClick={async () => {
                    setIsOpen(!isOpen);
                    navigate("/");
                  }}
                  className="w-full h-14 flex justify-center items-center whitespace-nowrap text-xl cursor-pointer border-b border-neutral-600 hover:bg-neutral-700 transition-all ease-in-out duration-500 text-white"
                >
                  Splash Page
                </div>
              )}
              <div
                data-testid="menu_logout_button"
                onClick={async () => {
                  socket && socket.current && socket.current.emit("message", { type: "logout", data: { id: user.id }});
                  setIsOpen(!isOpen);
                  await dispatch(logout());
                  navigate("/login");
                }}
                className="w-full h-14 flex justify-center items-center whitespace-nowrap text-xl cursor-pointer border-b border-neutral-600 hover:bg-neutral-700 transition-all ease-in-out duration-500 text-white"
              >
                Log Out
              </div>
            </>
          )}
        </section>
      </section>
    </>
  );
}
