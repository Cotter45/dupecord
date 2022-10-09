import Imagine from "./imagine";
import Remade from "./remade";
import InviteOnly from "./inviteOnly";
import Easy from "./easy";
import Fandom from "./fandom";
import Reliable from "./reliable";
import SignUpLink from "./signupLink";
import { useLocation } from "react-router-dom";

export default function Splash() {
  const location = useLocation();

  return (
    <div className="fade_in w-full h-full flex flex-col items-center">
      <div className="w-[90%] max-w-[1200px] flex flex-col items-center gap-12">
        <Imagine />
        <Remade />
        <InviteOnly />
        <Easy />
        <Fandom />
        <Reliable />
        {!location.pathname.includes("dupecord") && <SignUpLink />}
        {location.pathname.includes("dupecord") && (
          <div className="w-full h-10" />
        )}
      </div>
    </div>
  );
}