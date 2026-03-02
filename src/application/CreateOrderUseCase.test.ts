import { CreateOrderUseCase } from "./CreateOrderUseCase";
import { Product } from "../domain/entities/Product";
import { ShippingInfo } from "../domain/entities/Order";

describe("CreateOrderUseCase", () => {
  let useCase: CreateOrderUseCase;

  const mockProduct: Product = {
    id: "prod-123",
    name: "Reloj Minimalista",
    price: 350000,
    imageUrl: "https://example.com/reloj.jpg",
    description: "Un reloj increíble",
    stock: 10,
  };

  const mockShippingInfo: ShippingInfo = {
    fullName: "Juan Perez",
    email: "juan@example.com",
    address: "Calle 123",
    city: "Bogotá",
    country: "Colombia",
    phone: "3001234567",
  };

  beforeEach(() => {
    useCase = new CreateOrderUseCase();
  });

  test("debe calcular los totales de la orden correctamente", () => {
    const quantity = 2;
    const result = useCase.execute(mockProduct, quantity, mockShippingInfo);

    const expectedSubtotal = mockProduct.price * quantity; // 700,000
    const expectedBaseFee = 15000;
    const expectedShippingFee = 10000;
    const expectedTotal =
      expectedSubtotal + expectedBaseFee + expectedShippingFee; // 725,000

    expect(result.subtotal).toBe(expectedSubtotal);
    expect(result.baseFee).toBe(expectedBaseFee);
    expect(result.shippingFee).toBe(expectedShippingFee);
    expect(result.totalAmount).toBe(expectedTotal);
    expect(result.product).toEqual(mockProduct);
    expect(result.shippingInfo).toEqual(mockShippingInfo);
  });

  test("debe lanzar un error si la cantidad es 0 o menor", () => {
    expect(() => useCase.execute(mockProduct, 0, mockShippingInfo)).toThrow(
      "La cantidad debe ser mayor a 0",
    );
  });

  test("debe lanzar un error si el stock es insuficiente", () => {
    expect(() => useCase.execute(mockProduct, 11, mockShippingInfo)).toThrow(
      "Stock insuficiente",
    );
  });
});
