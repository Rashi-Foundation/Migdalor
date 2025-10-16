import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import { AuthProvider } from "../../contexts/AuthContext";
import { ThemeProvider } from "../../contexts/ThemeContext";
import Navbar from "../Navbar";

vi.mock("../NavItems", () => ({ default: () => <div>NavItems</div> }));
vi.mock("../LanguageSwitcher", () => ({
  default: () => <div>LanguageSwitcher</div>,
}));
vi.mock("../ThemeToggle", () => ({ default: () => <div>ThemeToggle</div> }));

const renderWithProviders = (ui) =>
  render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <ThemeProvider>{ui}</ThemeProvider>
        </AuthProvider>
      </I18nextProvider>
    </MemoryRouter>
  );

describe("Navbar", () => {
  it("renders logo and menu button", () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByAltText("logo")).toBeInTheDocument();
    expect(screen.getByLabelText("Toggle menu")).toBeInTheDocument();
  });

  it("toggles menu on button click", () => {
    renderWithProviders(<Navbar />);
    const menuButton = screen.getByLabelText("Toggle menu");

    fireEvent.click(menuButton);
    expect(screen.getByText("Documentation")).toBeInTheDocument();

    fireEvent.click(menuButton);
    expect(screen.queryByText("Documentation")).not.toBeInTheDocument();
  });

  it("shows logout button in menu", () => {
    renderWithProviders(<Navbar />);
    fireEvent.click(screen.getByLabelText("Toggle menu"));
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });
});
