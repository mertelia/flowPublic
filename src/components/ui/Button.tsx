"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps {
  fs?: number; // Opsiyonel
  height?: number; // Opsiyonel
  text: string; // Zorunlu (Yazısız buton olmaz)
  href: string; // Zorunlu
  className?: string; // Opsiyonel (Mobil hack'leri buraya gelecek)
}

export default function Button({
  fs = 25, // Default değerler
  height = 28,
  text,
  href,
  className,
}: ButtonProps) {
  const heightRem = height / 16;
  const fontSizeRem = fs / 16;

  const handleClick = () => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.button
      initial={{ opacity: 1 }}
      whileHover={{
        opacity: [1.0, 0.2, 0.8, 0.0, 1],
      }}
      transition={{
        duration: 0.2,
        ease: "linear",
      }}
      onClick={handleClick}
      style={
        {
          height: `var(--btn-h, ${heightRem}rem)`,
          fontSize: `var(--btn-fs, ${fontSizeRem}rem)`,
          letterSpacing: "-0.09em",
        } as any
      }
      className={`text-main flex gap-2 pr-2 justify-between items-center bg-secondary/36 hover:bg-secondary/18 transition duration-125 cursor-pointer shrink-0 ${className || ""}`}
    >
      <div
        style={{ width: `calc(var(--btn-h, ${heightRem}rem) / 3)` }}
        className="h-full bg-main shrink-0"
      />
      <div className="whitespace-nowrap px-1">{text}</div>
    </motion.button>
  );
}
