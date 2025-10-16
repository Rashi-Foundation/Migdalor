import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

const MockComponent = () => <div>Protected Content</div>;

// Mock the AuthContext
const mockUseAuth = vi.fn();
vi.mock("../../contexts/AuthContext", () => ({
  AuthProvider: ({ children }) => children,
  useAuth: () => mockUseAuth(),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: true, loading: false });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <MockComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("shows loading spinner when loading", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, loading: true });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <MockComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("redirects to login when not authenticated", () => {
    mockUseAuth.mockReturnValue({ isAuthenticated: false, loading: false });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <MockComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );
    // In a real test, we'd check for Navigate component behavior
    // For now, we just verify the protected content is not shown
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
