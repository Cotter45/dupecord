import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function SignUpLink() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.25 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <h2 className="w-full text-xl font-bold">Ready to start your journey?</h2>
      <button type="submit" onClick={() => navigate("/signup")}>
        Sign up
      </button>
    </motion.div>
  );
}