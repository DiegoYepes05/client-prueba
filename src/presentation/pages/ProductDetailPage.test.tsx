import { screen, fireEvent, act } from "@testing-library/react";
import ProductDetailPage from "./ProductDetailPage";
import { renderWithProviders } from "@/test-utils";
import { useProduct } from "../hooks/useProduct";

jest.mock("../hooks/useProduct");
const mockUseProduct = useProduct as jest.MockedFunction<typeof useProduct>;

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "1" }),
}));

describe("ProductDetailPage", () => {
  const mockProduct = {
    id: "1",
    name: "Reloj Elegante",
    price: 350000,
    imageUrl: "http://test.com/img.jpg",
    description: "Descripción del reloj",
    stock: 10,
  };

  test("debe mostrar el detalle del producto", async () => {
    mockUseProduct.mockReturnValue({
      product: mockProduct,
      products: [],
      loading: false,
      error: null,
    });

    await act(async () => {
      renderWithProviders(<ProductDetailPage />);
    });

    expect(screen.getByText(/Reloj Elegante/i)).toBeInTheDocument();
  });

  test("debe despachar setProduct al hacer clic en comprar", async () => {
    mockUseProduct.mockReturnValue({
      product: mockProduct,
      products: [],
      loading: false,
      error: null,
    });

    let storeResult: any;
    await act(async () => {
      const { store } = renderWithProviders(<ProductDetailPage />);
      storeResult = store;
    });

    const buyButton = screen.getByText(/Comprar ahora/i);
    await act(async () => {
      fireEvent.click(buyButton);
    });

    const state = storeResult.getState();
    expect(state.order.product).toEqual(mockProduct);
  });

  test("debe mostrar el cargando si loading es true", async () => {
    mockUseProduct.mockReturnValue({
      product: null,
      products: [],
      loading: true,
      error: null,
    });

    await act(async () => {
      renderWithProviders(<ProductDetailPage />);
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  test("debe mostrar mensaje si el producto no existe", async () => {
    mockUseProduct.mockReturnValue({
      product: null,
      products: [],
      loading: false,
      error: null,
    });

    await act(async () => {
      renderWithProviders(<ProductDetailPage />);
    });

    expect(screen.getByText(/Producto no encontrado/i)).toBeInTheDocument();

    const goHomeButton = screen.getByText(/Volver a la selección/i);
    await act(async () => {
      fireEvent.click(goHomeButton);
    });
  });

  test("debe mostrar alerta de stock bajo", async () => {
    mockUseProduct.mockReturnValue({
      product: { ...mockProduct, stock: 3 },
      products: [],
      loading: false,
      error: null,
    });

    await act(async () => {
      renderWithProviders(<ProductDetailPage />);
    });

    expect(screen.getByText(/¡Últimas 3!/i)).toBeInTheDocument();
  });
});
