"use client";

import Button from "@/components/ui/Button";
import { motion } from "framer-motion"; // Düzeltme: framer-motion import (eğer "motion/react" typo ise)

export default function Hero() {
  return (
    <div className="h-[80vh] w-[90%] mx-auto flex justify-center items-center flex-col gap-12 pt-24 md:pt-0">
      <motion.div
        className="flex justify-center items-center h-4 gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="h-full w-4 bg-main"></div>
        <div className="text-main pr-2 text-lg whitespace-nowrap">
          <span className="tracking-tight">EVENT</span>
          <span className="mx-1">&</span>
          <span className="tracking-tight">CONCERT</span>
          <span> MANAGEMENT</span>
        </div>
      </motion.div>
      <motion.div
        className="text-white md:text-5xl text-3xl text-center tracking-[-0.13em]"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        The talent brings the light, we provide the ground.
        <br />
        Expert stage architecture and technical rigging <br />
        designed for seamless performance
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      >
        <Button
          fs={25}
          height={28}
          text="contact@flowstage.com"
          href="https://x.com/mertelia"
        />
      </motion.div>
    </div>
  );
}
