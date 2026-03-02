import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/infrastructure/state/store";
import {
  createOrder,
  setShippingInfo,
  setAcceptance,
} from "@/infrastructure/state/slices/orderSlice";
import type { ShippingInfo } from "@/domain/entities/Order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";
import { AcceptanceStep } from "@/presentation/components/AcceptanceStep";

import { CheckoutLayout } from "../components/layout/CheckoutLayout";
import { formatCurrency } from "@/lib/format";

export default function ShippingPaymentPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { product, order, acceptedTerms, acceptedData } = useSelector(
    (state: RootState) => state.order,
  );
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});

  const [form, setForm] = useState<ShippingInfo>(
    order?.shippingInfo || {
      fullName: "",
      email: "",
      address: "",
      city: "",
      country: "Colombia",
      phone: "",
    },
  );

  useEffect(() => {
    dispatch(setShippingInfo(form));
  }, [form, dispatch]);

  const handleChange =
    (field: keyof ShippingInfo) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validate = (): boolean => {
    const newErrors: Partial<ShippingInfo> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Nombre requerido";
    if (!form.email.match(/^[^@]+@[^@]+\.[^@]+$/))
      newErrors.email = "Email inválido";
    if (!form.address.trim()) newErrors.address = "Dirección requerida";
    if (!form.city.trim()) newErrors.city = "Ciudad requerida";
    if (!form.phone.trim()) newErrors.phone = "Teléfono requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || !product || !acceptedTerms || !acceptedData) return;
    dispatch(createOrder({ product, quantity: 1, shippingInfo: form }));
    navigate("/payment");
  };

  if (!product) return null;

  return (
    <CheckoutLayout
      currentStep={1}
      backTo="/"
      backText="Volver al producto"
      title="Información de envío"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Información de envío
          </h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Datos personales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input
                      id="fullName"
                      placeholder="Juan Pérez"
                      value={form.fullName}
                      onChange={handleChange("fullName")}
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-red-500">{errors.fullName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="juan@email.com"
                      value={form.email}
                      onChange={handleChange("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+57 300 000 0000"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dirección de entrega</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      placeholder="Calle 123 # 45-67"
                      value={form.address}
                      onChange={handleChange("address")}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && (
                      <p className="text-xs text-red-500">{errors.address}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Ciudad</Label>
                    <Input
                      id="city"
                      placeholder="Bogotá"
                      value={form.city}
                      onChange={handleChange("city")}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500">{errors.city}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      placeholder="Colombia"
                      value={form.country}
                      onChange={handleChange("country")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-50 border-gray-100">
              <CardContent className="pt-6">
                <h2 className="font-semibold text-gray-800 mb-3">
                  Método de pago
                </h2>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    defaultChecked
                    name="payment"
                    className="accent-black"
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">
                      Tarjeta de crédito / débito
                    </span>
                  </div>
                </label>
              </CardContent>
            </Card>

            <AcceptanceStep />

            <Button
              type="submit"
              fullWidth
              disabled={!acceptedTerms || !acceptedData}
              className="text-base py-4"
            >
              Continuar al pago
            </Button>
          </form>
        </div>
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <h2 className="font-semibold text-gray-800 mb-4">
              Resumen del pedido
            </h2>
            <div className="flex gap-3 mb-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/64";
                }}
              />
              <div>
                <p className="font-medium text-gray-800 text-sm">
                  {product.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">Cantidad: 1</p>
              </div>
            </div>
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(product.price)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-black font-medium">Gratis</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 border-t pt-2 text-base">
                <span>Total</span>
                <span>{formatCurrency(product.price)} COP</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </CheckoutLayout>
  );
}
