import { GetProductUseCase } from "../../application/GetProductUseCase";
import { CreateOrderUseCase } from "../../application/CreateOrderUseCase";
import { ProcessPaymentUseCase } from "../../application/ProcessPaymentUseCase";
import { ApiProductRepository } from "../http/ApiProductRepository";
import { ApiPaymentGateway } from "../http/ApiPaymentGateway";
import { ApiMerchantRepository } from "../http/ApiMerchantRepository";
import { GetMerchantUseCase } from "../../application/GetMerchantUseCase";
import { GetPaymentsStatusUseCase } from "../../application/GetPaymentsStatusUseCase";
import { GetTransactionDetailUseCase } from "../../application/GetTransactionDetailUseCase";

const productRepository = new ApiProductRepository();
const paymentGateway = new ApiPaymentGateway();
const merchantRepository = new ApiMerchantRepository();

export const getProductUseCase = new GetProductUseCase(productRepository);
export const createOrderUseCase = new CreateOrderUseCase();
export const processPaymentUseCase = new ProcessPaymentUseCase(paymentGateway);
export const getMerchantUseCase = new GetMerchantUseCase(merchantRepository);
export const getPaymentsStatusUseCase = new GetPaymentsStatusUseCase(
  paymentGateway,
);
export const getTransactionDetailUseCase = new GetTransactionDetailUseCase(
  paymentGateway,
);
