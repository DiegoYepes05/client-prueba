import { ApiProductRepository } from "./ApiProductRepository";

describe("ApiProductRepository", () => {
  let repository: ApiProductRepository;

  beforeEach(() => {
    repository = new ApiProductRepository();

    global.fetch = jest.fn();
  });

  const mockProduct = {
    id: "1",
    name: "Producto de Prueba",
    price: 100,
    imageUrl: "test.jpg",
    description: "Descripción de prueba",
    stock: 10,
  };

  test("debe obtener un producto por su ID correctamente", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    });

    const result = await repository.getById("1");

    expect(result).toEqual(mockProduct);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/product/1"),
    );
  });

  test("debe lanzar un error si el producto no se encuentra", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(repository.getById("999")).rejects.toThrow(
      "Producto no encontrado: 999",
    );
  });

  test("debe obtener todos los productos correctamente", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [mockProduct],
    });

    const result = await repository.getAll();

    expect(result).toEqual([mockProduct]);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/product/all"),
    );
  });

  test("debe lanzar un error si falla la obtención de productos", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(repository.getAll()).rejects.toThrow(
      "Error al obtener los productos",
    );
  });
});
