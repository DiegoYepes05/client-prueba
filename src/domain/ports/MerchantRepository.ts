import { Merchant } from "../entities/Merchant";

export interface MerchantRepository {
  getMerchantInfo(): Promise<Merchant>;
}
