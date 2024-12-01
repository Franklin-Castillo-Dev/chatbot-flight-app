import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll al inicio
  }, [pathname]); // Se ejecuta cada vez que la ruta cambia

  return null; // Este componente no renderiza nada
};

export { ScrollToTop };
