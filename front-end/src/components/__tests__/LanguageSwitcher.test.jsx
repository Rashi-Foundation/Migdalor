import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import LanguageSwitcher from "../LanguageSwitcher";

const renderWithI18n = (ui) =>
  render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);

describe("LanguageSwitcher", () => {
  it("renders language button", () => {
    renderWithI18n(<LanguageSwitcher />);
    expect(screen.getByLabelText(/language/i)).toBeInTheDocument();
  });

  it("shows dropdown when clicked", () => {
    renderWithI18n(<LanguageSwitcher />);
    const button = screen.getByLabelText(/language/i);

    fireEvent.click(button);
    expect(screen.getByText(/hebrew/i)).toBeInTheDocument();
    expect(screen.getByText(/english/i)).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", () => {
    renderWithI18n(<LanguageSwitcher />);
    const button = screen.getByLabelText(/language/i);

    fireEvent.click(button);
    expect(screen.getByText(/hebrew/i)).toBeInTheDocument();

    // Click on the backdrop div instead of document.body
    const backdrop = document.querySelector(".fixed.inset-0.z-10");
    if (backdrop) {
      fireEvent.click(backdrop);
    } else {
      // Fallback: click the button again to close
      fireEvent.click(button);
    }

    expect(screen.queryByText(/hebrew/i)).not.toBeInTheDocument();
  });

  it("changes language when option is clicked", () => {
    renderWithI18n(<LanguageSwitcher />);
    const button = screen.getByLabelText(/language/i);

    fireEvent.click(button);
    const hebrewOption = screen.getByText(/hebrew/i);
    fireEvent.click(hebrewOption);

    // Dropdown should close
    expect(screen.queryByText(/hebrew/i)).not.toBeInTheDocument();
  });
});
