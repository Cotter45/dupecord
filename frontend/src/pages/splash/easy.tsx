import { motion } from 'framer-motion';

export default function Easy() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="mt-20 flex flex-col gap-6 md:flex-row-reverse items-center text-right md:text-left"
    >
      <img
        className="w-full md:w-[58%]"
        src="/575a0322f3b36ca2fecb23ad2c6dd5ad.svg"
      />
      <div className="flex flex-col gap-4">
        <h2 className="w-full text-2xl font-bold">Where hanging out is easy</h2>
        <p>
          Grab a seat in a voice channel when you’re free. Friends in your
          server can see you’re around and instantly pop in to talk without
          having to call.
        </p>
      </div>
    </motion.div>
  );
}