import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DeveloperManualPage from "@pages/DeveloperManualPage.jsx";
import { vi, describe, it, expect } from "vitest";

vi.mock("@components/Navbar", () => ({ default: () => <div>Navbar</div> }));
vi.mock("jspdf", () => ({
  default: vi.fn().mockImplementation(() => ({
    addImage: vi.fn(),
    save: vi.fn(),
    setFontSize: vi.fn(),
    text: vi.fn(),
    addPage: vi.fn(),
    splitTextToSize: () => [],
  })),
}));
vi.mock("html2canvas", () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue({
    toDataURL: () => "data:image/png;base64,abc",
    width: 100,
    height: 100,
  }),
}));

describe("DeveloperManualPage", () => {
  it("renders header and export button", () => {
    render(
      <MemoryRouter>
        <DeveloperManualPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Navbar/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /developer manual/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /export pdf/i })
    ).toBeInTheDocument();
  });
});
