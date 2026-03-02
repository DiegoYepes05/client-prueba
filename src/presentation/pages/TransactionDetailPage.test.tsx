import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import TransactionDetailPage from "./TransactionDetailPage";
import { usePayments } from "../hooks/usePayments";

jest.mock("../hooks/usePayments");
const mockUsePayments = usePayments as jest.Mock;

const mockTransaction = {
  id: "tx-123",
  reference: "REF-123",
  amountInCents: 252500000,
  currency: "COP",
  status: "APPROVED",
  createdAt: "2026-03-02T05:21:13.175Z",
  merchant: {
    name: "Test Merchant",
    email: "test@test.com",
    phoneNumber: "123",
    legalName: "Test Legal",
    legalId: "123",
    legalIdType: "CC",
  },
  paymentMethodType: "CARD",
  paymentMethod: {
    brand: "VISA",
    lastFour: "4242",
    installments: 1,
  },
};

describe("TransactionDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("debe mostrar el detalle de la transacción", () => {
    mockUsePayments.mockReturnValue({
      transaction: mockTransaction,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={["/transactions/tx-123"]}>
        <Routes>
          <Route path="/transactions/:id" element={<TransactionDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("REF-123")).toBeInTheDocument();
    expect(screen.getByText("Test Merchant")).toBeInTheDocument();
  });

  test("debe mostrar error cuando no existe la transacción", () => {
    mockUsePayments.mockReturnValue({
      transaction: null,
      loading: false,
      error: "No encontrada",
    });

    render(
      <MemoryRouter initialEntries={["/transactions/tx-not-found"]}>
        <Routes>
          <Route path="/transactions/:id" element={<TransactionDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByText("No se pudo encontrar la transacción"),
    ).toBeInTheDocument();
  });
});
