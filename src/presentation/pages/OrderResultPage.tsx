import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/infrastructure/state/store";
import { resetOrderFlow } from "@/infrastructure/state/slices/orderSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/format";
import { CheckoutLayout } from "../components/layout/CheckoutLayout";

export default function OrderResultPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { transaction, order } = useSelector((state: RootState) => state.order);

  const handleFinish = () => {
    dispatch(resetOrderFlow());
    navigate("/");
  };

  if (!transaction || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Button onClick={() => navigate("/")}>Volver al inicio</Button>
      </div>
    );
  }

  const isSuccess = transaction.status === "APPROVED";
  const isPending = transaction.status === "PENDING";

  return (
    <CheckoutLayout currentStep={4} title="Estado de tu pedido">
      <div className="flex items-center justify-center">
        <Card className="max-w-xl w-full text-center shadow-2xl relative overflow-hidden">
          <CardContent className="pt-8 flex flex-col items-center">
            <div
              className={`absolute top-0 left-0 w-full h-2 ${isSuccess ? "bg-black" : isPending ? "bg-gray-400" : "bg-gray-800"}`}
            />

            <div className="pt-4 flex flex-col items-center">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-sm font-bold mb-6 border-2 ${isSuccess ? "bg-white text-black border-black" : isPending ? "bg-gray-50 text-gray-500 border-gray-200" : "bg-black text-white border-black"}`}
              >
                {isSuccess ? "EXITO" : isPending ? "ESPERA" : "ERROR"}
              </div>

              <h1 className="text-3xl font-black text-gray-900 mb-2">
                {isSuccess
                  ? "¡Pago Exitoso!"
                  : isPending
                    ? "Pago Pendiente"
                    : "Pago Rechazado"}
              </h1>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                {isSuccess
                  ? "Tu pedido ha sido confirmado y está siendo preparado."
                  : isPending
                    ? "Tu pago está siendo procesado por Wompi. Te notificaremos cuando cambie el estado."
                    : "Hubo un problema con tu método de pago. Por favor intenta con otra tarjeta."}
              </p>

              <StatusBadge status={transaction.status} />

              <div className="w-full h-px bg-gray-100 my-8" />

              <div className="grid grid-cols-2 gap-4 w-full text-left mb-8">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Referencia
                  </p>
                  <p className="text-sm font-mono text-gray-700">
                    {transaction.reference}
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Fecha
                  </p>
                  <p className="text-sm text-gray-700">
                    {transaction.createdAt.toLocaleDateString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Monto total
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(transaction.amount)} COP
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Método
                  </p>
                  <p className="text-sm text-gray-700">
                    Tarjeta •••• {transaction.cardLastFour}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button fullWidth onClick={handleFinish}>
                  {isSuccess || isPending
                    ? "Seguir comprando"
                    : "Volver a intentarlo"}
                </Button>
                {isSuccess && (
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => window.print()}
                  >
                    Descargar recibo
                  </Button>
                )}
              </div>

              <p className="mt-8 text-xs text-gray-400">
                Hemos enviado un correo a{" "}
                <span className="text-gray-600 font-medium">
                  {order.shippingInfo.email}
                </span>{" "}
                con todos los detalles de tu compra.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CheckoutLayout>
  );
}
