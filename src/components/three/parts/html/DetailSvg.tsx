import { motion, AnimatePresence } from "framer-motion";

export default function DetailSvg() {
  return (
    <motion.svg
      width="247"
      height="80"
      viewBox="0 0 247 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <defs>
        <mask id="lineMask">
          <motion.path
            d="M0.649414 78.75L45.6827 0.75H246.649"
            stroke="white"
            strokeWidth="2"
            pathLength={0}
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
        </mask>
      </defs>

      <path
        d="M0.649414 78.75L45.6827 0.75H246.649"
        stroke="#62FF53"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        mask="url(#lineMask)"
      />
    </motion.svg>
  );
}
