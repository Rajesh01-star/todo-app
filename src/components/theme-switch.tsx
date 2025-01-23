"use client";

import { FC } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { BiMoon } from "react-icons/bi";
import { FaSun } from "react-icons/fa";

export interface ThemeSwitchProps {
  className?: string;
}

const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      <button
        onClick={toggleTheme}
        className={clsx(
          "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
          "text-gray-600 dark:text-gray-400",
          className
        )}
      >
        {theme === "light" ? <BiMoon /> : <FaSun />}
      </button>
    </>
  );
};

export default ThemeSwitch