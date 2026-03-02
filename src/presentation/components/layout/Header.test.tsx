import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";
import { BrowserRouter } from "react-router-dom";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Header component", () => {
  test("debe renderizar el título y links", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    expect(screen.getByText("Prueba Técnica")).toBeInTheDocument();
    expect(screen.getByText("Catálogo")).toBeInTheDocument();
    expect(screen.getByText("Mis Pagos")).toBeInTheDocument();
  });

  test("debe navegar al catálogo", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText("Catálogo"));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("debe navegar a mis pagos", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText("Mis Pagos"));
    expect(mockNavigate).toHaveBeenCalledWith("/transactions");
  });
});
