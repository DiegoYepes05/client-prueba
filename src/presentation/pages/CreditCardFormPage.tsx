import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/infrastructure/state/store";
import { setCardInfo as setOrderCardInfo } from "@/infrastructure/state/slices/orderSlice";
import type { CardInfo } from "@/domain/entities/Transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

import { CheckoutLayout } from "../components/layout/CheckoutLayout";
import {
  formatCardNumber,
  formatExpiryDate,
  detectCardBrand,
} from "@/lib/format";

export default function CreditCardFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cardInfo } = useSelector((state: RootState) => state.order);
  const [errors, setErrors] = useState<Partial<Record<keyof CardInfo, string>>>(
    {},
  );

  const [form, setForm] = useState<CardInfo>(
    cardInfo || {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    },
  );

  useEffect(() => {
    dispatch(setOrderCardInfo(form));
  }, [form, dispatch]);

  const handleChange =
    (field: keyof CardInfo) => (e: ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      if (field === "cardNumber") value = formatCardNumber(value);
      if (field === "expiryDate") value = formatExpiryDate(value);
      if (field === "cvv") value = value.replace(/\D/g, "").slice(0, 4);

      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CardInfo, string>> = {};
    if (form.cardNumber.replace(/\s/g, "").length < 16)
      newErrors.cardNumber = "Número incompleto";
    if (!form.cardHolder.trim()) newErrors.cardHolder = "Nombre requerido";
    if (form.expiryDate.length < 5) newErrors.expiryDate = "Fecha inválida";
    if (form.cvv.length < 3) newErrors.cvv = "CVV inválido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    dispatch(setOrderCardInfo(form));
    navigate("/summary");
  };

  const brand = detectCardBrand(form.cardNumber);

  return (
    <CheckoutLayout
      currentStep={2}
      backTo="/shipping"
      backText="Volver al envío"
      title="Método de pago"
    >
      <div className="mb-8">
        <div className="relative h-48 w-full rounded-2xl bg-linear-to-br from-gray-800 to-gray-900 p-6 text-white shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16 blur-2xl"></div>

          <div className="relative h-full flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="w-12 h-10 bg-linear-to-br from-gray-200 to-gray-400 rounded-lg shadow-inner opacity-80" />
              <span className="italic font-bold text-xl opacity-60">
                {brand || "CARD"}
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-xl tracking-[0.2em] font-mono leading-none">
                {form.cardNumber || "•••• •••• •••• ••••"}
              </p>
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider opacity-60">
                    Titular
                  </span>
                  <p className="text-sm font-medium uppercase tracking-widest truncate max-w-[200px]">
                    {form.cardHolder || "NOMBRE APELLIDO"}
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[10px] uppercase tracking-wider opacity-60">
                    Expira
                  </span>
                  <p className="text-sm font-medium tracking-widest">
                    {form.expiryDate || "MM/AA"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardHolder">Nombre en la tarjeta</Label>
              <Input
                id="cardHolder"
                placeholder="Como aparece en el plástico"
                value={form.cardHolder}
                onChange={handleChange("cardHolder")}
                className={errors.cardHolder ? "border-red-500" : ""}
              />
              {errors.cardHolder && (
                <p className="text-xs text-red-500">{errors.cardHolder}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número de tarjeta</Label>
              <Input
                id="cardNumber"
                placeholder="0000 0000 0000 0000"
                value={form.cardNumber}
                onChange={handleChange("cardNumber")}
                maxLength={19}
                className={errors.cardNumber ? "border-red-500" : ""}
              />
              {errors.cardNumber && (
                <p className="text-xs text-red-500">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Vencimiento</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/AA"
                  value={form.expiryDate}
                  onChange={handleChange("expiryDate")}
                  maxLength={5}
                  className={errors.expiryDate ? "border-red-500" : ""}
                />
                {errors.expiryDate && (
                  <p className="text-xs text-red-500">{errors.expiryDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  type="password"
                  value={form.cvv}
                  onChange={handleChange("cvv")}
                  maxLength={4}
                  className={errors.cvv ? "border-red-500" : ""}
                />
                {errors.cvv && (
                  <p className="text-xs text-red-500">{errors.cvv}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button type="submit" fullWidth className="py-4 text-base">
          Revisar pedido
        </Button>
      </form>
    </CheckoutLayout>
  );
}
