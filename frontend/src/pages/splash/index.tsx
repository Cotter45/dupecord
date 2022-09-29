import Imagine from "./imagine";
import Remade from "./remade";
import InviteOnly from "./inviteOnly";
import Easy from "./easy";
import Fandom from "./fandom";
import Reliable from "./reliable";
import SignUpLink from "./signupLink";

export default function Splash() {

  return (
    <div className="fade_in w-full h-full flex flex-col items-center">
      <div className="w-[90%] max-w-[1200px] h-full flex flex-col items-center gap-12">
        <Imagine />
        <Remade />
        <InviteOnly />
        <Easy />
        <Fandom />
        <Reliable />
        <SignUpLink />
      </div>
    </div>
  );
}