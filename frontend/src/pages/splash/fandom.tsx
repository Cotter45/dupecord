import { motion } from 'framer-motion';

export default function Fandom() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="mt-20 flex flex-col gap-6 md:flex-row items-center md:text-right"
    >
      <img
        className="w-full md:w-[58%]"
        src="/921b1ae33edca174b6ebe787bb8b6c3b.svg"
      />
      <div className="flex flex-col gap-4">
        <h2 className="w-full text-2xl font-bold">From few to a fandom</h2>
        <p>
          Get any community running with moderation tools and custom member
          access. Give members special powers, set up private channels, and
          more.
        </p>
      </div>
    </motion.div>
  );
}