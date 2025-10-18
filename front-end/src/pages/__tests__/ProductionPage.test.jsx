import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";
import ProductionPage from "@pages/ProductionPage.jsx";
import { vi, describe, it, expect } from "vitest";

vi.mock("react-chartjs-2", () => ({
  Pie: () => <div>PieChart</div>,
  Bar: () => <div>BarChart</div>,
  Line: () => <div>LineChart</div>,
  Doughnut: () => <div>DoughnutChart</div>,
}));

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      get: vi.fn().mockResolvedValue({ data: [] }),
      post: vi.fn().mockResolvedValue({ data: {} }),
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
    })),
    get: vi.fn().mockResolvedValue({ data: [] }),
  },
}));

// Mock the http module directly
vi.mock("../../api/http", () => ({
  http: {
    get: vi.fn(),
    post: vi.fn().mockResolvedValue({ data: {} }),
    interceptors: {
      response: {
        use: vi.fn(),
      },
    },
  },
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

describe("ProductionPage", () => {
  it("renders heading and loads data", async () => {
    const { http } = await import("../../api/http");
    http.get.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter>
        <I18nextProvider i18n={i18n}>
          <ProductionPage />
        </I18nextProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText(/Navbar/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /production/i, level: 1 })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(http.get).toHaveBeenCalled();
    });
  });
});
