import { motion } from 'framer-motion';

export default function Reliable() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="mt-20 flex flex-col gap-6 md:flex-row-reverse items-center text-right md:text-left"
    >
      <img
        className="w-full md:w-[58%]"
        src="/98ea5b9e92e304c7d352ac462996adc5.svg"
      />
      <div className="flex flex-col gap-4">
        <h2 className="w-full text-2xl font-bold">
          RELIABLE TECH FOR STAYING CLOSE
        </h2>
        <p>
          Low-latency voice and video feels like you’re in the same room. Wave
          hello over video, watch friends stream their games, or gather up and
          have a drawing session with screen share.
        </p>
      </div>
    </motion.div>
  );
}