import { Merchant } from "../domain/entities/Merchant";
import { MerchantRepository } from "../domain/ports/MerchantRepository";

export class GetMerchantUseCase {
  constructor(private readonly merchantRepository: MerchantRepository) {}

  async execute(): Promise<Merchant> {
    return this.merchantRepository.getMerchantInfo();
  }
}
