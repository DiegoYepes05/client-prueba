import {
  formatCurrency,
  formatCardNumber,
  formatExpiryDate,
  detectCardBrand,
} from "./index";

describe("Utilidades de formato", () => {
  describe("formatCurrency", () => {
    it("debe formatear un número como COP", () => {
      expect(formatCurrency(15000)).toMatch(/15[.,]000/);
      expect(formatCurrency(0)).toMatch(/0/);
    });
  });

  describe("formatCardNumber", () => {
    it("debe formatear un número de tarjeta con espacios", () => {
      expect(formatCardNumber("42424242")).toBe("4242 4242");
      expect(formatCardNumber("4242 4242")).toBe("4242 4242");
    });

    it("debe recortar a 16 dígitos", () => {
      expect(formatCardNumber("12345678123456789")).toBe("1234 5678 1234 5678");
    });
  });

  describe("formatExpiryDate", () => {
    it("debe formatear la fecha de vencimiento", () => {
      expect(formatExpiryDate("1229")).toBe("12/29");
      expect(formatExpiryDate("12/29")).toBe("12/29");
    });

    it("debe formatear parcialmente el mes o un solo dígito (sin pad por ahora según implementación)", () => {
      expect(formatExpiryDate("9")).toBe("9");
    });
  });

  describe("detectCardBrand", () => {
    it("debe retornar VISA para 4", () => {
      expect(detectCardBrand("4242")).toBe("VISA");
    });

    it("debe retornar MASTERCARD para 5", () => {
      expect(detectCardBrand("5242")).toBe("MASTERCARD");
    });

    it("debe retornar null para otros", () => {
      expect(detectCardBrand("3242")).toBe(null);
      expect(detectCardBrand("")).toBe(null);
    });
  });
});
