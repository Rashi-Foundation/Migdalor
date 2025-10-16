import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import WorkersPage from "@pages/WorkersPage.jsx";
import { vi, describe, it, expect } from "vitest";
vi.mock("@components/Navbar", () => ({ default: () => <div>Navbar</div> }));
vi.mock("@components/employees/EmployeeItem", () => ({
  default: () => <div>EmployeeItem</div>,
}));

describe("WorkersPage", () => {
  it("renders navbar and employee item", () => {
    render(
      <MemoryRouter>
        <WorkersPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Navbar/)).toBeInTheDocument();
    expect(screen.getByText(/EmployeeItem/)).toBeInTheDocument();
  });
});
