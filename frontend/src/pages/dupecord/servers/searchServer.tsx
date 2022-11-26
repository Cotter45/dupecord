import { FormEvent, useState } from "react";
import { createServer, joinServer } from "../../../redux/api";
import type { Server } from "../../../redux/api/api.types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { authFetch } from "../../../util/authFetch";
// import useDebounce from "../../../util/useDebounce";

export default function SearchServer({
  setSelectedServer,
  setShowModal,
}: {
  setSelectedServer: (server: Server) => void;
  setShowModal: (show: boolean) => void;
}) {
  const dispatch = useAppDispatch();

  const [value, setValue] = useState("");
  const [valueFocused, setValueFocused] = useState(false);
  const [results, setResults] = useState<Server[]>([]);
  const [error, setError] = useState("");
  const [amMemberOf, setAmMemberOf] = useState<number[]>([]);

  const servers = useAppSelector((state) => state.api.servers);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value || !value.length) return;

    const res = await authFetch(
      `/api/servers/search?name=${value}`
    );
    if (res.message) {
      setError(res.message);
      return;
    }
    setResults(res);
    const amMemberOf = servers.map((server: Server) => server.id);
    setAmMemberOf(amMemberOf);
  };

  return (
    <div
      className={`w-full max-w-[80vw] h-full max-h-[80vh] flex flex-col items-center bg-neutral-800 text-white p-4 rounded-md overflow-y-auto ${
        results.length ? "justify-start" : "justify-center"
      }`}
    >
      <h2 className="text-2xl text-left w-full max-w-[600px]">
        Search for servers
      </h2>
      <p className="text-gray-400 max-w-[600px] text-sm">
        Enter the name of the server you're looking for and select it from the
        list that will populate below. If the server is private, a request will
        be sent to the server owner to join.
      </p>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="relative w-full max-w-[600px] flex flex-col gap-2"
      >
        <label
          className={`required self-start translate-y-10 translate-x-6 transition-all ease-in-out duration-500 ${
            (valueFocused || value.length) && "translate-y-0 -translate-x-2"
          }`}
          htmlFor="name"
          onMouseEnter={() => setValueFocused(true)}
        >
          Server Name
        </label>
        <input
          type="search"
          name="name"
          id="name"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onMouseEnter={() => setValueFocused(true)}
          onMouseLeave={() => setValueFocused(false)}
          className="w-full p-2 rounded-md border border-neutral-400"
        />
        {error && <p className="text-red-500">{error}</p>}
        {results.length > 0 && (
          <div className="fade_in w-[80%] h-[40vh] flex flex-col self-center gap-2 overflow-y-auto">
            {results.map((server) => (
              <div
                key={server.id}
                className="w-full p-2 rounded-md border border-neutral-400 hover:bg-neutral-700 cursor-pointer flex gap-4 items-center"
                onClick={async () => {
                  if (amMemberOf.includes(server.id)) {
                    return;
                  }
                  if (!server.private) {
                    const fullServer = await dispatch(joinServer(server.id));
                    if (fullServer) {
                      setSelectedServer(fullServer.payload);
                    }
                    setShowModal(false);
                  }
                }}
              >
                <img src={server.icon} alt="" className="w-8 h-8 rounded-md" />
                <div className="flex flex-col">
                  <p className="text-md">{server.name}</p>
                  {!server.private && (
                    <p className="text-gray-400 text-xs">
                      {/* @ts-ignore */}
                      Members: {server._count.members}
                      {amMemberOf.includes(server.id) && (
                        <span className="text-green-500 ml-2">Joined</span>
                      )}
                    </p>
                  )}
                  {server.private && (
                    <p className="text-red-600 text-xs justify-self-end">
                      Private
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          type="submit"
          className="w-full p-2 rounded-md mt-4 border border-neutral-400"
        >
          Search
        </button>
      </form>
    </div>
  );
}
