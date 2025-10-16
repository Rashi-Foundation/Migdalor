import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "@pages/HomePage.jsx";
import { vi, describe, it, expect } from "vitest";

vi.mock("@components/Navbar", () => ({ default: () => <div>Navbar</div> }));
vi.mock("@components/DateTime", () => ({ default: () => <div>DateTime</div> }));
vi.mock("@components/UpdatesCards", () => ({
  default: () => <div>Updates</div>,
}));
vi.mock("@components/ProductionEfficiencyChart", () => ({
  default: () => <div>ProductionEfficiencyChart</div>,
}));
vi.mock("@components/DepartmentPerformanceOverview", () => ({
  default: () => <div>DepartmentPerformanceOverview</div>,
}));

describe("HomePage", () => {
  it("renders core sections", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Navbar/)).toBeInTheDocument();
    expect(screen.getByText(/DateTime/)).toBeInTheDocument();
    expect(screen.getByText(/Updates/)).toBeInTheDocument();
    expect(screen.getByText(/ProductionEfficiencyChart/)).toBeInTheDocument();
    expect(
      screen.getByText(/DepartmentPerformanceOverview/)
    ).toBeInTheDocument();
  });
});
