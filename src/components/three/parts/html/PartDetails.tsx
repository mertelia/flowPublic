import DetailSvg from "./DetailSvg";
import { motion } from "framer-motion"; // motion/react kullanıyorsan öyle bırakabilirsin

export default function PartDetails({
  header,
  detail,
}: {
  header: string;
  detail: string;
}) {
  return (
    <div className="w-fit h-55 text-white flex gap-4 p-4">
      <div className="h-full flex items-start pt-3">
        <DetailSvg />
      </div>

      <div className="flex flex-col gap-2 flex-1 w-fit max-w-3xl">
        <div className="flex items-center gap-2">
          <motion.div
            className="h-4 w-4 bg-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0 } }}
            transition={{ delay: 0.55, duration: 0.5 }}
          ></motion.div>
          <motion.div
            className="text-main text-lg whitespace-nowrap font-medium flex flex-wrap items-center gap-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, transition: { delay: 0 } }}
            transition={{ delay: 0.65, duration: 0.5 }}
          >
            <span className="tracking-tight text-lg">{header}</span>
          </motion.div>
        </div>

        <motion.p
          className="text-white text-lg leading-5 tracking-tighter max-w-md "
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, transition: { delay: 0 } }}
          transition={{ delay: 0.75, duration: 0.5 }}
        >
          {detail}
        </motion.p>
      </div>
    </div>
  );
}
