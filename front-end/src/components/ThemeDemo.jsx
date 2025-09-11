import React from "react";
import { useTheme } from "@contexts/ThemeContext";

const ThemeDemo = () => {
  const { theme, isDark } = useTheme();

  return (
    <div className="theme-bg-secondary theme-shadow-lg rounded-xl p-6 m-4 transition-all duration-300">
      <h3 className="text-xl font-bold theme-text-primary mb-4">
        🌙 Dark Mode Demo
      </h3>

      <div className="space-y-4">
        <div className="theme-bg-tertiary p-4 rounded-lg transition-colors duration-300">
          <p className="theme-text-primary">
            Current theme: <span className="font-semibold">{theme}</span>
          </p>
          <p className="theme-text-secondary text-sm">
            This card adapts to the current theme automatically!
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="theme-bg-primary theme-border-primary border p-3 rounded-lg transition-colors duration-300">
            <p className="theme-text-primary text-sm font-medium">
              Primary Background
            </p>
          </div>
          <div className="theme-bg-secondary theme-border-secondary border p-3 rounded-lg transition-colors duration-300">
            <p className="theme-text-secondary text-sm font-medium">
              Secondary Background
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button className="theme-accent theme-accent-hover text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105">
            Accent Button
          </button>
          <button className="theme-border-primary border theme-text-primary px-4 py-2 rounded-lg hover:theme-bg-tertiary transition-all duration-200">
            Outline Button
          </button>
        </div>

        <div className="theme-text-tertiary text-sm">
          ✨ All colors and shadows automatically adjust based on the selected
          theme!
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;
