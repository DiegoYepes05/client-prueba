import { GetProductUseCase } from "./GetProductUseCase";
import { ProductRepository } from "../domain/ports/ProductRepository";
import { Product } from "../domain/entities/Product";

describe("GetProductUseCase", () => {
  let useCase: GetProductUseCase;
  let mockProductRepository: jest.Mocked<ProductRepository>;

  const mockProduct: Product = {
    id: "prod-1",
    name: "Reloj",
    price: 350000,
    imageUrl: "url",
    description: "desc",
    stock: 10,
  };

  beforeEach(() => {
    mockProductRepository = {
      getAll: jest.fn(),
      getById: jest.fn(),
    };
    useCase = new GetProductUseCase(mockProductRepository);
  });

  test("debe ejecutar getById correctamente", async () => {
    mockProductRepository.getById.mockResolvedValue(mockProduct);

    const result = await useCase.execute("prod-1");

    expect(result).toEqual(mockProduct);
    expect(mockProductRepository.getById).toHaveBeenCalledWith("prod-1");
  });

  test("debe ejecutar getAll correctamente", async () => {
    mockProductRepository.getAll.mockResolvedValue([mockProduct]);

    const result = await useCase.getAll();

    expect(result).toEqual([mockProduct]);
    expect(mockProductRepository.getAll).toHaveBeenCalled();
  });
});
