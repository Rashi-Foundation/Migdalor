import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import StationPage from "@pages/StationPage.jsx";
import { vi, describe, it, expect } from "vitest";

vi.mock("@components/Navbar", () => ({ default: () => <div>Navbar</div> }));
vi.mock("@hooks/useMe", () => ({ useMe: () => ({ me: { isAdmin: true } }) }));
vi.mock("@components/stations/StationNavigation", () => ({
  __esModule: true,
  default: ({ activeSection, onSectionChange }) => (
    <div>
      <div>StationNavigation</div>
      <button onClick={() => onSectionChange("assignment")}>Assignment</button>
      <button onClick={() => onSectionChange("management")}>Management</button>
      <div>Active:{activeSection}</div>
    </div>
  ),
}));
vi.mock("@components/stations/AssinmentComp", () => ({
  default: () => <div>AssignmentComp</div>,
}));
vi.mock("@components/stations/StationManagement", () => ({
  default: () => <div>StationManagement</div>,
}));

describe("StationPage", () => {
  it("renders navigation and toggles sections", () => {
    render(
      <MemoryRouter>
        <StationPage />
      </MemoryRouter>
    );

    expect(screen.getByText(/Navbar/)).toBeInTheDocument();
    expect(screen.getByText(/StationNavigation/)).toBeInTheDocument();
    expect(screen.getByText(/AssignmentComp/)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Management/));
    expect(screen.getByText(/StationManagement/)).toBeInTheDocument();
  });
});
