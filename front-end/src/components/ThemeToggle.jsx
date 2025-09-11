import React from "react";
import { useTheme } from "@contexts/ThemeContext";
import { IoSunny, IoMoon } from "react-icons/io5";

const ThemeToggle = ({ className = "" }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        w-12 h-6 rounded-full
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
          isDark
            ? "bg-gradient-to-r from-purple-500 to-blue-500 focus:ring-purple-500"
            : "bg-gradient-to-r from-yellow-400 to-orange-400 focus:ring-yellow-400"
        }
        ${className}
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Toggle circle */}
      <div
        className={`
          absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
          shadow-lg transform transition-transform duration-300 ease-in-out
          flex items-center justify-center
          ${isDark ? "translate-x-6" : "translate-x-0"}
        `}
      >
        {isDark ? (
          <IoMoon className="w-3 h-3 text-purple-600" />
        ) : (
          <IoSunny className="w-3 h-3 text-yellow-500" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
