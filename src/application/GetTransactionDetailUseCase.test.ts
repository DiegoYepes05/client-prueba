import { GetTransactionDetailUseCase } from "./GetTransactionDetailUseCase";
import { PaymentGateway } from "../domain/ports/PaymentGateway";

describe("GetTransactionDetailUseCase", () => {
  test("debe llamar al gateway para obtener el detalle", async () => {
    const mockGateway: Partial<PaymentGateway> = {
      getTransactionDetail: jest.fn().mockResolvedValue({ id: "1" } as any),
    };
    const useCase = new GetTransactionDetailUseCase(
      mockGateway as PaymentGateway,
    );
    const result = await useCase.execute("1");
    expect(result).toEqual({ id: "1" });
    expect(mockGateway.getTransactionDetail).toHaveBeenCalledWith("1");
  });
});
