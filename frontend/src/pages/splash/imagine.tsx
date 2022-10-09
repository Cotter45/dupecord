import { useLocation, useParams } from "react-router-dom";

export default function Imagine() {
  const params = useParams();
  const location = useLocation();

  return (
    <div className={`${location.pathname.includes('dupecord') && !params.id ? 'w-[calc(100%)]' : 'w-[100vw] bg-blue-900'} relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8`}>
      <div className="w-full max-w-[1000px] flex flex-col items-center justify-center gap-2">
        <h1>IMAGINE A PLACE</h1>
        <p className="self-center text-center max-w-[800px]">
          ...where you can belong to a school club, a gaming group, or a worldwide
          art community. Where just you and a handful of friends can spend time
          together. A place that makes it easy to talk every day and hang out more
          often.
        </p>
        <div className="flex flex-col md:flex-row md:w-[100vw]  justify-between items-end">
          <img
            className="w-full md:max-w-[40vw]"
            src="/8a8375ab7908384e1fd6efe408284203.svg"
          />
          <img
            className="hidden md:flex w-full md:max-w-[40vw]"
            src="/c40c84ca18d84633a9d86b4046a91437.svg"
          />
        </div>
        <img
          className="absolute w-full z-1"
          src="/a188414ce83f2454b9d71a47c3d95909.svg"
        />              
      </div>
    </div>
  );
}