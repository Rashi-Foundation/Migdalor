import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../../contexts/ThemeContext";
import { vi, describe, it, expect, beforeEach } from "vitest";

const TestComponent = () => {
  const { theme, isDark, isLight, toggleTheme } = useTheme();
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <div data-testid="isDark">{isDark ? "dark" : "light"}</div>
      <div data-testid="isLight">{isLight ? "light" : "dark"}</div>
      <button onClick={toggleTheme} data-testid="toggle">
        Toggle Theme
      </button>
    </div>
  );
};

const renderWithTheme = () =>
  render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides theme context", () => {
    renderWithTheme();

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(screen.getByTestId("isDark")).toHaveTextContent("light");
    expect(screen.getByTestId("isLight")).toHaveTextContent("light");
  });

  it("toggles theme on button click", () => {
    renderWithTheme();

    const toggleButton = screen.getByTestId("toggle");
    fireEvent.click(toggleButton);

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("isDark")).toHaveTextContent("dark");
    expect(screen.getByTestId("isLight")).toHaveTextContent("dark");
  });

  it("persists theme in localStorage", () => {
    renderWithTheme();

    const toggleButton = screen.getByTestId("toggle");
    fireEvent.click(toggleButton);

    expect(localStorage.getItem("theme")).toBe("dark");
  });

  it("loads theme from localStorage on mount", () => {
    localStorage.setItem("theme", "dark");

    renderWithTheme();

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useTheme must be used within a ThemeProvider");

    consoleSpy.mockRestore();
  });
});
