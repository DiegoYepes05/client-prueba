export const getApiUrl = () => {

  if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
    return "http://localhost:3000";
  }




  try {
    return eval("import.meta.env.VITE_API_URL") || "http://localhost:3000/api";
  } catch (e) {
    return "http://localhost:3000/api";
  }
};
