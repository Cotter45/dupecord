import { motion } from 'framer-motion';

export default function InviteOnly() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="mt-40 flex flex-col gap-6 md:flex-row items-center md:text-right"
    >
      <img
        className="w-full md:w-[58%]"
        src="/46b2132c01604c9493d558de444929f4.svg"
      />
      <div className="flex flex-col gap-4">
        <h2 className="w-full text-2xl font-bold">
          Create an invite-only place where you belong
        </h2>
        <p>
          Discord servers are organized into topic-based channels where you can
          collaborate, share, and just talk about your day without clogging up a
          group chat.
        </p>
      </div>
    </motion.div>
  );
}