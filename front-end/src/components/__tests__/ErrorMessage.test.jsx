import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorMessage from "../ErrorMessage";

describe("ErrorMessage", () => {
  it("renders error message when show is true", () => {
    render(<ErrorMessage message="Test error" show={true} type="server" />);
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });

  it("does not render when show is false", () => {
    render(<ErrorMessage message="Test error" show={false} type="server" />);
    expect(screen.queryByText("Test error")).not.toBeInTheDocument();
  });

  it("does not render when message is empty", () => {
    render(<ErrorMessage message="" show={true} type="server" />);
    expect(screen.queryByText("Test error")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <ErrorMessage
        message="Test error"
        show={true}
        type="server"
        onClose={onClose}
      />
    );

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it("applies correct styles for different error types", () => {
    const { rerender } = render(
      <ErrorMessage message="Server error" show={true} type="server" />
    );
    // Traverse up to the root container which has the style classes
    const serverEl = screen.getByText("Server error");
    const serverContainer =
      serverEl.closest("div")?.parentElement?.parentElement?.parentElement;
    expect(serverContainer).toHaveClass("bg-red-100");

    rerender(<ErrorMessage message="Auth error" show={true} type="auth" />);
    const authEl = screen.getByText("Auth error");
    const authContainer =
      authEl.closest("div")?.parentElement?.parentElement?.parentElement;
    expect(authContainer).toHaveClass("bg-orange-100");
  });
});
