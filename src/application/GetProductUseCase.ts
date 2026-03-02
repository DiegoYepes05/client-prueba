import { Product } from "../domain/entities/Product";
import { ProductRepository } from "../domain/ports/ProductRepository";

export class GetProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(id: string): Promise<Product> {
    return this.productRepository.getById(id);
  }

  async getAll(): Promise<Product[]> {
    return this.productRepository.getAll();
  }
}
