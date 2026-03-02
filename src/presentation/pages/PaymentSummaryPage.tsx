import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/infrastructure/state/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CheckoutLayout } from "../components/layout/CheckoutLayout";
import { formatCurrency, detectCardBrand } from "@/lib/format";

export default function PaymentSummaryPage() {
  const navigate = useNavigate();
  const { order, cardInfo } = useSelector((state: RootState) => state.order);

  const handleConfirm = () => {
    navigate("/processing");
  };

  if (!order || !cardInfo) {
    return (
      <div className="p-20 text-center">
        Datos incompletos. Por favor vuelve a empezar.
      </div>
    );
  }

  const { product, shippingInfo, totalAmount } = order;
  const brand = detectCardBrand(cardInfo.cardNumber);

  return (
    <CheckoutLayout
      currentStep={3}
      backTo="/payment"
      backText="Volver al pago"
      title="Confirma tu pedido"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Dirección de envío
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-gray-900">
                  {shippingInfo.fullName}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {shippingInfo.address}
                  <br />
                  {shippingInfo.city}, {shippingInfo.country}
                </p>
                <p className="text-gray-500 text-xs mt-2 italic">
                  {shippingInfo.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Método de pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-gray-900 rounded flex items-center justify-center text-[10px] text-white font-bold italic">
                  {brand || "CARD"}
                </div>
                <div>
                  <p className="text-gray-800 font-medium">
                    Tarjeta terminada en {cardInfo.cardNumber.slice(-4)}
                  </p>
                  <p className="text-gray-500 text-xs uppercase">
                    {cardInfo.cardHolder}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Detalle de compra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-20 h-20 rounded-2xl object-cover bg-gray-50"
                />
                <div className="flex flex-col justify-center">
                  <p className="font-bold text-gray-900">{product.name}</p>
                  <p className="text-gray-500 text-sm">
                    Cantidad: {order.quantity}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Precio unitario</span>
                  <span>{formatCurrency(product.price)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Tarifa Base</span>
                  <span>{formatCurrency(order.baseFee)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Envío</span>
                  <span>{formatCurrency(order.shippingFee)}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-gray-900 border-t border-gray-100 pt-4 mt-4">
                  <span>Total</span>
                  <span className="text-black">
                    {formatCurrency(totalAmount)}{" "}
                    <small className="text-[10px] text-gray-400 font-medium">
                      COP
                    </small>
                  </span>
                </div>
              </div>

              <div className="mt-8 space-y-4 hidden lg:block">
                <Button
                  fullWidth
                  onClick={handleConfirm}
                  className="py-4 text-base"
                >
                  Comprar ahora
                </Button>
                <p className="text-[10px] text-center text-gray-400 leading-relaxed">
                  Al hacer clic en "Comprar ahora", aceptas nuestros términos de
                  servicio y política de privacidad.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-gray-200 p-6 z-50 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] backdrop-blur-md bg-white/90">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              Total a pagar
            </p>
            <p className="text-2xl font-black text-gray-900">
              {formatCurrency(totalAmount)}
            </p>
          </div>
          <p className="text-[10px] text-gray-400 text-right max-w-[120px]">
            Impuestos y tarifas incluidos
          </p>
        </div>
        <Button
          fullWidth
          onClick={handleConfirm}
          size="lg"
          className="py-6 text-lg shadow-xl"
        >
          Pagar ahora
        </Button>
      </div>
    </CheckoutLayout>
  );
}
