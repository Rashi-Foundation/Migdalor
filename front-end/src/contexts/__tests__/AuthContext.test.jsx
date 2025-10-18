import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock the http module
vi.mock("../../api/http", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: "/test" }),
  };
});
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
  beforeEach(async () => {
    localStorage.clear();
    vi.clearAllMocks();
    const { http } = await import("../../api/http");
    http.get.mockRejectedValue(new Error("Not authenticated"));
  });

  it("provides authentication context", async () => {
    renderWithAuth();

    // Wait for the auth check to complete
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    expect(screen.getByTestId("user")).toHaveTextContent("No User");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
  });

  it("handles login", async () => {
    renderWithAuth();

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    await act(async () => {
      const loginButton = screen.getByTestId("login");
      fireEvent.click(loginButton);
    });

    expect(screen.getByTestId("user")).toHaveTextContent("testuser");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
  });

  it("handles logout", async () => {
    renderWithAuth();

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByTestId("loading")).toHaveTextContent("false");
    });

    // First login
    await act(async () => {
      fireEvent.click(screen.getByTestId("login"));
    });
    expect(screen.getByTestId("authenticated")).toHaveTextContent("true");

    // Then logout
    await act(async () => {
      fireEvent.click(screen.getByTestId("logout"));
    });
    expect(screen.getByTestId("user")).toHaveTextContent("No User");
    expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
  });

  it("throws error when used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow("useAuth must be used within an AuthProvider");

    consoleSpy.mockRestore();
  });
});
