import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import UserManualPage from "@pages/UserManualPage.jsx";
import { vi, describe, it, expect } from "vitest";
vi.mock("@components/Navbar", () => ({ default: () => <div>Navbar</div> }));

describe("UserManualPage", () => {
  it("renders header", () => {
    render(
      <MemoryRouter>
        <UserManualPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Navbar/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /manual/i })
    ).toBeInTheDocument();
  });
});
