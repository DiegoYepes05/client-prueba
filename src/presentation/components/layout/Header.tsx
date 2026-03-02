import { useNavigate } from "react-router-dom";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors group"
        >
          <span className="text-sm font-medium">Catálogo</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <span className="text-white text-xs font-bold">PT</span>
          </div>
          <span className="font-bold text-gray-800 text-lg hidden sm:block">
            Prueba Técnica
          </span>
        </div>
      </div>
    </header>
  );
}
