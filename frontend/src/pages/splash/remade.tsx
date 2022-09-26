import { motion } from "framer-motion";

export default function Remade() {
  return (
    <>
      <h2 className="text-3xl font-bold">Remade with</h2>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="relative w-full max-w-[700px] flex flex-wrap gap-10 justify-center"
      >
        <a href="https://vitejs.dev" target="_blank">
          <img
            src="/vite.svg"
            className="w-20 h-20 hover:transform hover:scale-[.8] transition-all ease-in-out duration-500 relative z-[1] scale-[.7]"
            alt="Vite logo"
          />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img
            src="/react.svg"
            className="w-20 h-20 hover:transform hover:scale-90 transition-all ease-in-out duration-500 relative z-[1] scale-[.8]"
            alt="React logo"
          />
        </a>
        <a href="https://redux-toolkit.js.org/" target="_blank">
          <img
            src="/redux.svg"
            className="w-20 h-20 hover:transform hover:scale-110 transition-all ease-in-out duration-500 relative z-[1]"
            alt="Redux logo"
          />
        </a>
        <a href="https://socket.io/" target="_blank">
          <img
            src="/socketio.svg"
            className="w-20 h-20 hover:transform hover:scale-100 transition-all ease-in-out duration-500 relative z-[1] scale-90"
            alt="SocketIO logo"
          />
        </a>
        <a href="https://www.typescriptlang.org/docs/" target="_blank">
          <img
            src="/ts.svg"
            className="w-20 h-20 hover:transform hover:scale-90 transition-all ease-in-out duration-500 relative z-[1] scale-[.8]"
            alt="Typescript logo"
          />
        </a>
        <a href="https://expressjs.com/" target="_blank">
          <img
            src="/express.svg"
            className="w-20 h-20 hover:transform hover:scale-110 transition-all ease-in-out duration-500 relative z-[1]"
            alt="Express logo"
          />
        </a>
        <a href="https://www.postgresql.org/docs/" target="_blank">
          <img
            src="/postgres.svg"
            className="w-20 h-20 hover:transform hover:scale-[1.3] transition-all ease-in-out duration-500 relative z-[1] scale-125"
            alt="PostgreSQL logo"
          />
        </a>
        <a
          className="flex flex-col items-center justify-evenly"
          href="https://www.prisma.io/docs/"
          target="_blank"
        >
          <img
            src="/prisma.svg"
            className="w-16 h-16 hover:transform hover:scale-[1.6] transition-all ease-in-out duration-500 relative z-[1] scale-[1.4]"
            alt="Prisma logo"
          />
          <label className="">Prisma</label>
        </a>
        <img
          className="absolute -bottom-10 z-0 opacity-50"
          src="/e6d57714479874c665b36c7adee76b1d.svg"
        />
      </motion.div>
    </>
  )
}