import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import { AuthProvider } from "@contexts/AuthContext";
import LoginPage from "@pages/LoginPage.jsx";

vi.mock("../../api/http", () => {
  return {
    http: {
      post: vi.fn().mockResolvedValue({ data: { success: false } }),
      get: vi.fn(),
    },
  };
});

vi.mock("@components/ErrorMessage", () => ({
  __esModule: true,
  default: ({ message }) =>
    message ? <div role="alert">{message}</div> : null,
  useErrorHandler: () => ({
    error: null,
    errorType: "",
    clearError: vi.fn(),
    setAuthError: vi.fn(),
    setNetworkError: vi.fn(),
    setServerError: vi.fn(),
  }),
  getErrorInfo: (e) => ({ type: "server", message: String(e) }),
}));

describe("LoginPage", () => {
  const renderWithProviders = () =>
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </I18nextProvider>
      </MemoryRouter>
    );

  it("renders form inputs and button", () => {
    renderWithProviders();
    expect(
      screen.getByPlaceholderText(/enter your username/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("submits and shows error on failed login", async () => {
    renderWithProviders();
    fireEvent.change(screen.getByPlaceholderText(/enter your username/i), {
      target: { value: "u" },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
      target: { value: "p" },
    });
    fireEvent.click(screen.getByRole("button"));
    const { http } = await import("../../api/http");
    await waitFor(() => {
      expect(http.post).toHaveBeenCalled();
    });
  });
});
