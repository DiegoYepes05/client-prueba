import { useParams, useNavigate } from "react-router-dom";
import { usePayments } from "../hooks/usePayments";

import { Header } from "../components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Spinner } from "@/components/ui/spinner";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transaction, loading, error } = usePayments(id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="lg" className="text-black" />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-3xl mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No se pudo encontrar la transacción
          </h1>
          <p className="text-gray-500 mb-8">{error || "ID no válido"}</p>
          <Button onClick={() => navigate("/transactions")}>
            Volver al historial
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/30">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/transactions")}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          <span className="text-sm font-bold uppercase tracking-widest">
            Volver al historial
          </span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Status Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-2xl shadow-gray-200/50 overflow-hidden rounded-[32px]">
              <CardContent className="p-0">
                <div className="bg-black p-10 text-white">
                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <p className="text-xs font-bold opacity-50 uppercase tracking-[0.2em] mb-2">
                        Referencia de Pago
                      </p>
                      <h1 className="text-2xl font-mono font-black">
                        {transaction.reference}
                      </h1>
                    </div>
                    <StatusBadge status={transaction.status} />
                  </div>

                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <p className="text-xs font-bold opacity-50 uppercase tracking-[0.2em] mb-2">
                        Total Pagado
                      </p>
                      <p className="text-5xl font-black font-mono">
                        {formatCurrency(transaction.amountInCents / 100)}
                        <span className="text-xl ml-2 opacity-50 font-normal">
                          {transaction.currency}
                        </span>
                      </p>
                    </div>
                    <div className="text-right opacity-50 text-xs font-bold">
                      ID: {transaction.id}
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-white grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                      Información del Comercio
                    </h3>
                    <p className="text-lg font-bold text-gray-900 mb-1">
                      {transaction.merchant.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.merchant.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.merchant.phoneNumber}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                      Método de Pago
                    </h3>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold">
                        {transaction.paymentMethodType}
                      </div>
                      <p className="font-bold text-gray-900">
                        {transaction.paymentMethod.extra?.brand} ****{" "}
                        {transaction.paymentMethod.extra?.lastFour}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {transaction.paymentMethod.installments} cuota(s)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-[24px] border-gray-100 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                    Fecha de Creación
                  </h3>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-[24px] border-gray-100 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                    Fecha de Finalización
                  </h3>
                  <p className="text-lg font-bold text-gray-900">
                    {transaction.finalizedAt
                      ? new Date(transaction.finalizedAt).toLocaleString()
                      : "En proceso"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="rounded-[32px] border-none shadow-xl shadow-gray-200/30 overflow-hidden">
              <div className="bg-gray-100 p-6">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                  Detalles Adicionales
                </h3>
              </div>
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1">
                    Nombre Legal
                  </p>
                  <p className="text-sm font-medium">
                    {transaction.merchant.legalName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1">
                    Identificación
                  </p>
                  <p className="text-sm font-medium">
                    {transaction.merchant.legalIdType}:{" "}
                    {transaction.merchant.legalId}
                  </p>
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-400 mb-2">
                    Mensaje del Estado
                  </p>
                  <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-600 font-medium">
                    {transaction.statusMessage || "Sin mensajes adicionales."}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-8 bg-black rounded-[32px] text-white text-center">
              <p className="text-sm font-bold mb-4">
                ¿Necesitas ayuda con este pago?
              </p>
              <Button
                variant="outline"
                className="w-full rounded-2xl border-white/20 text-white hover:bg-white/10"
              >
                Contactar Soporte
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
