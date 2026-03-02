import { GetPaymentsStatusUseCase } from "./GetPaymentsStatusUseCase";
import { PaymentGateway } from "../domain/ports/PaymentGateway";

describe("GetPaymentsStatusUseCase", () => {
  test("debe llamar al gateway para obtener todos los estados", async () => {
    const mockGateway: Partial<PaymentGateway> = {
      getPaymentsStatus: jest.fn().mockResolvedValue([{ id: "1" }] as any),
    };
    const useCase = new GetPaymentsStatusUseCase(mockGateway as PaymentGateway);
    const result = await useCase.execute();
    expect(result).toEqual([{ id: "1" }]);
    expect(mockGateway.getPaymentsStatus).toHaveBeenCalled();
  });
});
