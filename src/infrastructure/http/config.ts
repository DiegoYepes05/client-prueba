export const getApiUrl = () => {
  if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
    return "http://localhost:3000";
  }

  try {
    // Usamos eval para ocultar el uso de import.meta del parser de Jest/Istanbul
    // ya que en un entorno CJS (como el de los tests) falla el parseo de import.meta
    return eval("import.meta.env.VITE_API_URL") || "http://localhost:3000";
  } catch {
    return "http://localhost:3000";
  }
};
