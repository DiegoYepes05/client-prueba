import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductListPage from "../pages/ProductListPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import ShippingPaymentPage from "../pages/ShippingPaymentPage";
import CreditCardFormPage from "../pages/CreditCardFormPage";
import PaymentSummaryPage from "../pages/PaymentSummaryPage";
import TransactionProgressPage from "../pages/TransactionProgressPage";
import OrderResultPage from "../pages/OrderResultPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/shipping" element={<ShippingPaymentPage />} />
        <Route path="/payment" element={<CreditCardFormPage />} />
        <Route path="/summary" element={<PaymentSummaryPage />} />
        <Route path="/processing" element={<TransactionProgressPage />} />
        <Route path="/result" element={<OrderResultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
