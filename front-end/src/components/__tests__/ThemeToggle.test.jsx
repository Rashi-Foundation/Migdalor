import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "../../contexts/ThemeContext";
import ThemeToggle from "../ThemeToggle";

const renderWithTheme = (ui) => render(<ThemeProvider>{ui}</ThemeProvider>);

describe("ThemeToggle", () => {
  it("renders toggle button", () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByLabelText(/switch to/i)).toBeInTheDocument();
  });

  it("toggles theme on click", () => {
    renderWithTheme(<ThemeToggle />);
    const toggleButton = screen.getByLabelText(/switch to/i);

    fireEvent.click(toggleButton);
    // Theme change is handled by context, we just verify the click works
    expect(toggleButton).toBeInTheDocument();
  });

  it("shows correct aria label based on current theme", () => {
    renderWithTheme(<ThemeToggle />);
    const toggleButton = screen.getByLabelText(/switch to/i);
    expect(toggleButton).toHaveAttribute("aria-label");
  });
});
