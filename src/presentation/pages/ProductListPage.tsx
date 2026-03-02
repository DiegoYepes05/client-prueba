import { useNavigate } from "react-router-dom";
import { useProduct } from "@/presentation/hooks/useProduct";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Header } from "../components/layout/Header";
import { formatCurrency } from "@/lib/format";

export default function ProductListPage() {
  const navigate = useNavigate();
  const { products, loading, error } = useProduct();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner size="lg" className="text-black" />
      </div>
    );
  }

  const list = products;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {error && (
        <div className="max-w-6xl mx-auto px-6 mt-4">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-black">
            Catálogo de demo
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-gray-900 mb-8 italic text-center">
          Explora nuestra colección
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {list.map((p) => (
            <Card
              key={p.id}
              className="group h-full flex flex-col hover:shadow-xl transition-all duration-300 border-transparent hover:border-gray-200 overflow-hidden cursor-pointer"
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <div className="aspect-square overflow-hidden bg-gray-50 relative border-b border-gray-100">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {p.stock < 5 && (
                  <div className="absolute top-3 right-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                    ¡ÚLTIMAS {p.stock}!
                  </div>
                )}
              </div>

              <CardContent className="p-5 flex flex-col flex-1 gap-2">
                <h3 className="font-bold text-gray-900 group-hover:text-black transition-colors">
                  {p.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
                <div className="mt-auto pt-2 flex items-center justify-between font-mono">
                  <span className="text-lg font-black text-gray-900">
                    {formatCurrency(p.price)}
                  </span>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Ver más
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
