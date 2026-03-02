import { Merchant } from "../../domain/entities/Merchant";
import { MerchantRepository } from "../../domain/ports/MerchantRepository";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export class ApiMerchantRepository implements MerchantRepository {
  async getMerchantInfo(): Promise<Merchant> {
    const res = await fetch(`${API_URL}/payment/merchants`);
    if (!res.ok) throw new Error("Error al obtener información del comercio");
    const response = await res.json();
    return response.data;
  }
}
