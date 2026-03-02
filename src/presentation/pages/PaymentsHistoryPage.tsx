import { useNavigate } from "react-router-dom";
import { usePayments } from "../hooks/usePayments";
import { Header } from "../components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Spinner } from "@/components/ui/spinner";
import { formatCurrency } from "@/lib/format";
import { PaymentStatus } from "@/domain/entities/Transaction";

export default function PaymentsHistoryPage() {
  const navigate = useNavigate();
  const { payments, loading, error } = usePayments();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="lg" className="text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
              Historial de Pagos
            </h1>
            <p className="text-gray-500 font-medium">
              Consulta el estado de todas tus transacciones.
            </p>
          </div>
          <div className="bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-3 shadow-xl">
            <span className="text-sm opacity-70">Total Transacciones</span>
            <span className="text-2xl font-mono">{payments.length}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-8 flex items-center gap-3">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {payments.length === 0 && !error ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💸</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No hay transacciones
            </h3>
            <p className="text-gray-500">Aún no has realizado ningún pago.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {payments.map((payment: PaymentStatus) => (
              <Card
                key={payment.id}
                className="border border-gray-100 hover:border-black transition-colors overflow-hidden group cursor-pointer shadow-sm hover:shadow-md"
                onClick={() => navigate(`/transactions/${payment.wompiId}`)}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Status Section */}
                    <div className="p-6 md:w-48 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 group-hover:bg-black group-hover:text-white transition-colors duration-300">
                      <StatusBadge status={payment.status} />
                    </div>

                    {/* Main Info */}
                    <div className="p-6 flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Referencia
                        </p>
                        <p className="font-mono font-bold text-sm truncate">
                          {payment.reference}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
                          Wompi ID: {payment.wompiId}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Cliente
                        </p>
                        <p className="font-bold text-gray-900">
                          {payment.user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {payment.user.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                          Monto
                        </p>
                        <p className="text-2xl font-black text-gray-900 font-mono">
                          {formatCurrency(payment.amountInCents / 100)}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                          {payment.currency}
                        </p>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="p-6 bg-gray-50/50 md:w-64 border-t md:border-t-0 md:border-l border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        Envío
                      </p>
                      <p className="text-xs font-bold text-gray-700 leading-tight mb-1">
                        {payment.shippingAddress}
                      </p>
                      <p className="text-[10px] text-gray-500 font-medium">
                        {payment.shippingCity}, {payment.shippingDepartment}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                          Fecha
                        </p>
                        <p className="text-xs font-mono font-medium">
                          {new Date(payment.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
