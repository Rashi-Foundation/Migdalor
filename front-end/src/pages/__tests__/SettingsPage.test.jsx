import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import SettingsPage from "@pages/SettingsPage.jsx";
import { vi, describe, it, expect } from "vitest";

vi.mock("@components/Navbar", () => ({ default: () => <div>Navbar</div> }));
vi.mock("@components/DateTime", () => ({ default: () => <div>DateTime</div> }));
vi.mock("../../api/http", () => ({
  http: {
    put: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

vi.mock("@hooks/useMe", () => ({
  useMe: () => ({ me: { username: "alice", isAdmin: true }, loading: false }),
}));

vi.mock("@components/ErrorMessage", () => ({
  __esModule: true,
  default: ({ message }) =>
    message ? <div role="alert">{message}</div> : null,
  useErrorHandler: () => ({
    error: null,
    errorType: "",
    clearError: vi.fn(),
    setValidationError: vi.fn(),
    setAuthError: vi.fn(),
    setServerError: vi.fn(),
    setSuccess: vi.fn(),
  }),
  getErrorInfo: () => ({ type: "server", message: "error" }),
}));

describe("SettingsPage", () => {
  it("renders header and user info", () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <SettingsPage />
        </I18nextProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Navbar/)).toBeInTheDocument();
    expect(screen.getByText(/DateTime/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /settings/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
  });

  it("allows typing passwords and clicking update", () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <SettingsPage />
        </I18nextProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/enter new password/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm new password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /change password/i }));
  });
});
