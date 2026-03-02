import { Product } from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/ports/ProductRepository";

import { getApiUrl } from "./config";

const API_URL = getApiUrl();

export class ApiProductRepository implements ProductRepository {
  async getById(id: string): Promise<Product> {
    const res = await fetch(`${API_URL}/product/${id}`);
    if (!res.ok) throw new Error(`Producto no encontrado: ${id}`);
    return res.json();
  }

  async getAll(): Promise<Product[]> {
    const res = await fetch(`${API_URL}/product/all`);
    if (!res.ok) throw new Error("Error al obtener los productos");
    return res.json();
  }
}
