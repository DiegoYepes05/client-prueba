import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "@/presentation/hooks/useProduct";
import { useDispatch } from "react-redux";
import { setProduct as setOrderProduct } from "@/infrastructure/state/slices/orderSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { Product } from "@/domain/entities/Product";

import { CheckoutLayout } from "../components/layout/CheckoutLayout";
import { formatCurrency } from "@/lib/format";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading, error } = useProduct(id);

  const handleBuy = () => {
    if (!product) return;
    dispatch(setOrderProduct(product));
    navigate("/shipping");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="lg" className="text-black" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <CheckoutLayout
      currentStep={0}
      backTo="/"
      backText="Volver al catálogo"
      title="Selección de producto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div className="relative">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-xl">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full">
            EN STOCK
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-black font-semibold text-sm uppercase tracking-wider mb-2">
              Producto destacado
            </p>
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            <span className="text-gray-500 text-sm">COP</span>
          </div>

          <p className="text-gray-600 leading-relaxed">{product.description}</p>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 rounded-full bg-black inline-block" />
            {product.stock} unidades disponibles
          </div>

          <Button fullWidth onClick={handleBuy} className="text-base py-4">
            Comprar ahora
          </Button>
        </div>
      </div>
    </CheckoutLayout>
  );
}
