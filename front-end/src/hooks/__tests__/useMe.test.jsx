import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { useMe } from "../../hooks/useMe";
import { vi, describe, it, expect, beforeEach } from "vitest";
const TestComponent = () => {
  const { me, loading } = useMe();
  return (
    <div>
      <div data-testid="loading">{loading ? "Loading" : "Not Loading"}</div>
      <div data-testid="user">{me ? me.username : "No User"}</div>
    </div>
  );
};

// Mock the AuthContext
const mockUseAuth = vi.fn();
vi.mock("../../contexts/AuthContext", () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => mockUseAuth(),
}));

describe("useMe hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns user data and loading state", () => {
    mockUseAuth.mockReturnValue({
      user: { username: "testuser" },
      loading: false,
    });

    render(<TestComponent />);

    expect(screen.getByTestId("loading")).toHaveTextContent("Not Loading");
    expect(screen.getByTestId("user")).toHaveTextContent("testuser");
  });

  it("handles loading state", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true });

    render(<TestComponent />);

    expect(screen.getByTestId("loading")).toHaveTextContent("Loading");
    expect(screen.getByTestId("user")).toHaveTextContent("No User");
  });

  it("handles no user state", () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false });

    render(<TestComponent />);

    expect(screen.getByTestId("loading")).toHaveTextContent("Not Loading");
    expect(screen.getByTestId("user")).toHaveTextContent("No User");
  });
});
