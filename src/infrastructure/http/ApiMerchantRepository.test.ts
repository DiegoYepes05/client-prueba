import { ApiMerchantRepository } from "./ApiMerchantRepository";

describe("ApiMerchantRepository", () => {
  let repository: ApiMerchantRepository;

  beforeEach(() => {
    repository = new ApiMerchantRepository();

    global.fetch = jest.fn();
  });

  const mockMerchant = {
    id: 1,
    name: "Comercio de Prueba",
    contactName: "Juan Perez",
    contactPhone: "3001234567",
    acceptanceToken: "token-123",
  };

  test("debe obtener la información del comercio correctamente", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockMerchant }),
    });

    const result = await repository.getMerchantInfo();

    expect(result).toEqual(mockMerchant);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/payment/merchants"),
    );
  });

  test("debe lanzar un error si falla la obtención del comercio", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
    });

    await expect(repository.getMerchantInfo()).rejects.toThrow(
      "Error al obtener información del comercio",
    );
  });
});
