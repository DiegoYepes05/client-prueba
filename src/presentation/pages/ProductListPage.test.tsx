import "@testing-library/jest-dom";
import { screen, fireEvent } from "@testing-library/react";
import ProductListPage from "./ProductListPage";
import { renderWithProviders } from "@/test-utils";
import { useProduct } from "../hooks/useProduct";
import * as router from "react-router-dom";

jest.mock("../hooks/useProduct");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

const mockUseProduct = useProduct as jest.MockedFunction<typeof useProduct>;
const mockNavigate = jest.fn();

describe("ProductListPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (router.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  const mockProducts = [
    {
      id: "1",
      name: "Reloj Minimalista",
      price: 350000,
      imageUrl: "url1",
      description: "Desc 1",
      stock: 10,
    },
    {
      id: "2",
      name: "Billetera Cuero",
      price: 150000,
      imageUrl: "url2",
      description: "Desc 2",
      stock: 3,
    },
  ];

  test("debe mostrar la lista de productos correctamente", () => {
    mockUseProduct.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      product: null,
    });

    renderWithProviders(<ProductListPage />);

    expect(screen.getByText(/Reloj Minimalista/i)).toBeInTheDocument();
    expect(screen.getByText(/Billetera Cuero/i)).toBeInTheDocument();
  });

  test("debe mostrar el badge de últimas unidades si el stock es bajo", () => {
    mockUseProduct.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      product: null,
    });

    renderWithProviders(<ProductListPage />);

    expect(screen.getByText(/¡ÚLTIMAS 3!/i)).toBeInTheDocument();
  });

  test("debe mostrar el spinner de carga", () => {
    mockUseProduct.mockReturnValue({
      products: [],
      loading: true,
      error: null,
      product: null,
    });

    renderWithProviders(<ProductListPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("debe navegar al producto al hacer click", () => {
    mockUseProduct.mockReturnValue({
      products: mockProducts,
      loading: false,
      error: null,
      product: null,
    });

    renderWithProviders(<ProductListPage />);

    const card = screen.getByText(/Reloj Minimalista/i).closest(".group");
    fireEvent.click(card!);

    expect(mockNavigate).toHaveBeenCalledWith("/product/1");
  });

  test("debe mostrar el mensaje de error si ocurre uno", () => {
    mockUseProduct.mockReturnValue({
      products: [],
      loading: false,
      error: "Error",
      product: null,
    });

    renderWithProviders(<ProductListPage />);
    expect(screen.getByText(/Catálogo de demo/i)).toBeInTheDocument();
  });
});
