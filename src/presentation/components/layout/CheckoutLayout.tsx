import { useNavigate } from "react-router-dom";

const CHECKOUT_STEPS = [
  "Producto",
  "Información",
  "Pago",
  "Resumen",
  "Resultado",
];

interface CheckoutLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  backTo?: string;
  backText?: string;
  title?: string;
}

export function CheckoutLayout({
  children,
  currentStep,
  backTo,
  backText,
  title,
}: CheckoutLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {backTo && (
            <button
              onClick={() => navigate(backTo)}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm mb-4"
            >
              {backText || "Volver"}
            </button>
          )}

          <div className="flex items-center gap-0">
            {CHECKOUT_STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex items-center gap-1.5 text-xs font-medium ${
                    i <= currentStep ? "text-black" : "text-gray-400"
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i < currentStep
                        ? "bg-black text-white"
                        : i === currentStep
                          ? "border-2 border-black text-black"
                          : "border-2 border-gray-200 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="hidden sm:block">{s}</span>
                </div>
                {i < CHECKOUT_STEPS.length - 1 && (
                  <div
                    className={`h-px w-8 mx-2 ${
                      i < currentStep ? "bg-black" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {title && (
          <h1 className="text-2xl font-bold text-gray-900 mb-8 italic text-center">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
