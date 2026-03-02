export const getApiUrl = () => {
  // 1. Entorno de pruebas (Jest/Node)
  if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
    return "http://localhost:3000";
  }

  // 2. Entorno de Navegador (Vite)
  // Usamos eval para que el parseo estático de Jest ignore import.meta,
  // mientras que Vite lo reemplazará o ejecutará en tiempo real en el browser.
  try {
    return eval("import.meta.env.VITE_API_URL") || "http://localhost:3000/api";
  } catch (e) {
    return "http://localhost:3000/api";
  }
};
