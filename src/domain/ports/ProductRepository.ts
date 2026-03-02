import { Product } from "../entities/Product";

export interface ProductRepository {
  getById(id: string): Promise<Product>;
  getAll(): Promise<Product[]>;
}
