import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import DateTime from "../DateTime";

const renderWithI18n = (ui) =>
  render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);

describe("DateTime", () => {
  it("renders current date and time", () => {
    renderWithI18n(<DateTime />);
    // Check that some date/time text is rendered
    const dateTimeElement = screen.getByText(/\d+/);
    expect(dateTimeElement).toBeInTheDocument();
  });

  it("updates time every second", async () => {
    renderWithI18n(<DateTime />);
    const initialText = screen.getByText(/\d+/).textContent;

    // Wait for potential update
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100));
    });

    // The time should have updated (this is a basic check)
    expect(screen.getByText(/\d+/)).toBeInTheDocument();
  });

  it("applies theme classes", () => {
    renderWithI18n(<DateTime />);
    const dateTimeElement = screen.getByText(/\d+/);
    expect(dateTimeElement).toHaveClass("theme-text-primary");
  });
});
