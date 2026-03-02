import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import PaymentsHistoryPage from "./PaymentsHistoryPage";
import { usePayments } from "../hooks/usePayments";

jest.mock("../hooks/usePayments");
const mockUsePayments = usePayments as jest.Mock;

const mockPayments = [
  {
    id: "1",
    wompiId: "w-1",
    reference: "REF-1",
    amountInCents: 10000,
    currency: "COP",
    status: "APPROVED",
    user: { name: "Diego", email: "diego@test.com" },
    shippingAddress: "Calle 1",
    shippingCity: "Medellin",
    shippingDepartment: "Antioquia",
    createdAt: new Date().toISOString(),
  },
];

describe("PaymentsHistoryPage", () => {
  test("debe mostrar el historial de pagos", () => {
    mockUsePayments.mockReturnValue({
      payments: mockPayments,
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <PaymentsHistoryPage />
      </BrowserRouter>,
    );

    expect(screen.getByText("Historial de Pagos")).toBeInTheDocument();
    expect(screen.getByText("REF-1")).toBeInTheDocument();
    expect(screen.getByText("Diego")).toBeInTheDocument();
  });

  test("debe mostrar mensaje cuando no hay transacciones", () => {
    mockUsePayments.mockReturnValue({
      payments: [],
      loading: false,
      error: null,
    });

    render(
      <BrowserRouter>
        <PaymentsHistoryPage />
      </BrowserRouter>,
    );

    expect(screen.getByText("No hay transacciones")).toBeInTheDocument();
  });
});
