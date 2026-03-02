import { Product } from "../../domain/entities/Product";
import { ProductRepository } from "../../domain/ports/ProductRepository";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

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
