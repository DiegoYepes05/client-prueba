import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/infrastructure/state/store";
import {
  tokenizeCard,
  processPayment,
} from "@/infrastructure/state/slices/orderSlice";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TransactionProgressPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { order, cardInfo, merchant, error } = useSelector(
    (state: RootState) => state.order,
  );
  const [internalError, setInternalError] = useState<string | null>(null);
  const flowStarted = useRef(false);

  useEffect(() => {
    if (!order || !cardInfo || !merchant) {
      console.log("Missing data:", { order, cardInfo, merchant });
      return;
    }

    const runPaymentFlow = async () => {
      try {
        console.log("Starting payment flow execution...");

        const tokenizeResult = await dispatch(tokenizeCard(cardInfo)).unwrap();
        console.log("Card tokenized successfully:", tokenizeResult);

        const acceptanceToken = merchant.presigned_acceptance.acceptance_token;

        const resultAction = await dispatch(
          processPayment({
            order,
            cardToken: tokenizeResult,
            acceptanceToken,
          }),
        );

        if (processPayment.fulfilled.match(resultAction)) {
          console.log("Payment completed successfully");
          navigate("/result");
        }
      } catch (err: any) {
        console.error("Payment flow error:", err);
        setInternalError(
          err.message || (typeof err === "string" ? err : "Error desconocido"),
        );
      }
    };

    const timer = setTimeout(() => {
      if (flowStarted.current) return;
      flowStarted.current = true;
      runPaymentFlow();
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, [order, cardInfo, merchant, dispatch, navigate]);

  const displayError = error || internalError;

  if (displayError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-white">
        <Card className="max-w-md w-full text-center border-red-200">
          <CardContent className="pt-6 space-y-4">
            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl mx-auto">
              !
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Error en el proceso
            </h2>
            <p className="text-gray-600 text-sm">{displayError}</p>
            <Button
              variant="link"
              onClick={() => navigate("/summary")}
              className="text-black p-0 h-auto font-bold"
            >
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order || !cardInfo || !merchant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-500 mb-4">
          Faltan datos de la transacción o información del comercio. Por favor,
          reinicia el proceso.
        </p>
        <Button onClick={() => navigate("/")}>Ir al Inicio</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
      <div className="relative mb-8">
        <Spinner size="lg" className="text-black relative z-10 w-24 h-24" />
      </div>

      <div className="text-center space-y-2 relative z-10">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          Procesando tu pago
        </h1>
        <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
          Estamos verificando tus datos de manera segura. Por favor, no cierres
          esta ventana.
        </p>
      </div>

      <div className="mt-12 flex gap-2">
        <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce" />
      </div>
    </div>
  );
}
