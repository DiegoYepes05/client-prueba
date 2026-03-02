import { GetMerchantUseCase } from "./GetMerchantUseCase";
import { MerchantRepository } from "../domain/ports/MerchantRepository";
import { Merchant } from "../domain/entities/Merchant";

describe("GetMerchantUseCase", () => {
  let useCase: GetMerchantUseCase;
  let mockMerchantRepository: jest.Mocked<MerchantRepository>;

  const mockMerchant: Merchant = {
    id: 1,
    name: "Comercio de Prueba",
    public_key: "pub_test_123",
    presigned_acceptance: {
      acceptance_token: "acc-123",
      permalink: "https://example.com/terms",
      type: "ACCEPTANCE",
    },
    presigned_personal_data_auth: {
      acceptance_token: "data-123",
      permalink: "https://example.com/data",
      type: "PERSONAL_DATA",
    },
  };

  beforeEach(() => {
    mockMerchantRepository = {
      getMerchantInfo: jest.fn(),
    };
    useCase = new GetMerchantUseCase(mockMerchantRepository);
  });

  test("debe ejecutar y obtener la información del comercio correctamente", async () => {
    mockMerchantRepository.getMerchantInfo.mockResolvedValue(mockMerchant);

    const result = await useCase.execute();

    expect(result).toEqual(mockMerchant);
    expect(mockMerchantRepository.getMerchantInfo).toHaveBeenCalled();
  });
});
