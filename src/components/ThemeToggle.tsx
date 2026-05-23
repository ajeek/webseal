import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "motion/react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-white/10 dark:bg-black/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors backdrop-blur-md border border-gray-200 dark:border-white/10 flex items-center justify-center overflow-hidden w-10 h-10"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "dark" ? 0 : 90,
          scale: theme === "dark" ? 1 : 0,
          opacity: theme === "dark" ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute text-blue-400"
      >
        <Moon size={20} />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "light" ? 0 : -90,
          scale: theme === "light" ? 1 : 0,
          opacity: theme === "light" ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="absolute text-indigo-600"
      >
        <Sun size={20} />
      </motion.div>
    </button>
  );
}
