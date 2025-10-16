import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import ReportsPage from "@pages/ReportsPage.jsx";

import { vi, describe, it, expect } from "vitest";

vi.mock("react-chartjs-2", () => ({
  Bar: () => <div>BarChart</div>,
  Line: () => <div>LineChart</div>,
  Doughnut: () => <div>DoughnutChart</div>,
  Radar: () => <div>RadarChart</div>,
  PolarArea: () => <div>PolarChart</div>,
}));

vi.mock("@components/Navbar", () => ({ default: () => <div>Navbar</div> }));
vi.mock("@components/ErrorMessage", () => ({
  __esModule: true,
  default: ({ message }) =>
    message ? <div role="alert">{message}</div> : null,
  useErrorHandler: () => ({
    error: null,
    errorType: "",
    clearError: vi.fn(),
    setNetworkError: vi.fn(),
    setServerError: vi.fn(),
  }),
  getErrorInfo: () => ({ type: "server", message: "error" }),
}));

vi.mock("axios", () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
  },
}));

describe("ReportsPage", () => {
  it("renders header and controls", async () => {
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <ReportsPage />
        </I18nextProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Navbar/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /reports/i, level: 1 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /generate/i })
    ).toBeInTheDocument();
  });

  it("clicking generate triggers data fetch", async () => {
    const { default: axios } = await import("axios");
    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <ReportsPage />
        </I18nextProvider>
      </MemoryRouter>
    );
    const btn = await screen.findByRole("button", { name: /generate/i });
    fireEvent.click(btn);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });
});
