"use client";

import { FC, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { BiMoon } from "react-icons/bi";
import { FaSun } from "react-icons/fa";

export interface ThemeSwitchProps {
  className?: string;
}

const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className={clsx(
        "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        "text-gray-600 dark:text-gray-400",
        className
      )}
      aria-label="Toggle theme"
    >
      {theme === "light" ? <BiMoon size={20} /> : <FaSun size={20} />}
    </button>
  );
};

export default ThemeSwitch;