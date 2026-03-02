import { Order, ShippingInfo } from "../domain/entities/Order";
import { Product } from "../domain/entities/Product";

export class CreateOrderUseCase {
  execute(
    product: Product,
    quantity: number,
    shippingInfo: ShippingInfo,
  ): Order {
    if (quantity <= 0) throw new Error("La cantidad debe ser mayor a 0");
    if (product.stock < quantity) throw new Error("Stock insuficiente");

    const subtotal = product.price * quantity;
    const baseFee = 15000;
    const shippingFee = 10000;

    return {
      product,
      quantity,
      shippingInfo,
      subtotal,
      baseFee,
      shippingFee,
      totalAmount: subtotal + baseFee + shippingFee,
    };
  }
}
