import { useNavigate } from "react-router-dom";
import NavMenu from "./menu";

function Nav() {
  const navigate = useNavigate();

  return (
    <header
      data-testid="nav_container"
      className="w-full p-4 flex justify-between items-center border-b border-gray-500"
    >
      <div
        onClick={() => navigate("/")}
        className="text-2xl text-white cursor-pointer"
      >
        <img
          src="/dupecord.png"
          alt="logo"
          className="w-10 h-10 inline-block mr-2"
        />
        Dupecord
      </div>
      <NavMenu />
    </header>
  );
}

export default Nav;
