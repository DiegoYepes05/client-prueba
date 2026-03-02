import { Merchant } from "../../domain/entities/Merchant";
import { MerchantRepository } from "../../domain/ports/MerchantRepository";

import { getApiUrl } from "./config";

const API_URL = getApiUrl();

export class ApiMerchantRepository implements MerchantRepository {
  async getMerchantInfo(): Promise<Merchant> {
    const res = await fetch(`${API_URL}/payment/merchants`);
    if (!res.ok) throw new Error("Error al obtener información del comercio");
    const response = await res.json();
    return response.data;
  }
}
