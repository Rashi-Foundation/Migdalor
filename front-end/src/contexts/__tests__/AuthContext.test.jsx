import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider, useAuth } from "../AuthContext";
import { vi, describe, it, expect, beforeEach } from "vitest";
const TestComponent = () => {
  const { user, isAuthenticated, loading, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="user">{user ? user.username : "No User"}</div>
      <div data-testid="authenticated">
        {isAuthenticated ? "true" : "false"}
      </div>
      <div data-testid="loading">{loading ? "true" : "false"}</div>
      <button
        onClick={() => login({ username: "testuser" })}
        data-testid="login"
      >
        Login
      </button>
      <button onClick={logout} data-testid="logout">
        Logout
      </button>
    </div>
  );
};

const renderWithAuth = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </MemoryRouter>
  );

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("provides authentication context", () => {
    renderWithAuth();

    expect(screen.getByTestId("user")).toHaveTextContent("No User");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("handles login", () => {
    renderWithAuth();

    const loginButton = screen.getByTestId("login");
    fireEvent.click(loginButton);

    expect(screen.getByTestId("user")).toHaveTextContent("testuser");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
    // Note: With httpOnly cookies, we no longer store user data in localStorage
  });

  it("handles logout", () => {
    renderWithAuth();

    // First login
    fireEvent.click(screen.getByTestId("login"));
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");

    // Then logout
    fireEvent.click(screen.getByTestId("logout"));
    expect(screen.getByTestId("user")).toHaveTextContent("No User");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
    // Note: With httpOnly cookies, we no longer manage localStorage for auth
  });

  it("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useAuth must be used within an AuthProvider");

    consoleSpy.mockRestore();
  });
});
