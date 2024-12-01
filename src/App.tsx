import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { FlightSearchShell } from "./modules/flightSearch/shell/FlightSearchShell";
import { AppShell } from "./modules/app-shell/AppShell";
import { ErrorPage } from "./modules/error-page/ErrorPage";
import { ScrollToTop } from "./services/scrollToTop";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <ScrollToTop />
        {/* Se asegura de que cada cambio de ruta haga scroll al inicio */}
        <AppShell />
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // Esta es la ruta predeterminada que lleva a la página principal
        element: <FlightSearchShell />, // Aquí renderizamos el componente Home para la ruta '/'
      },
      {
        path: "calendar",
        element: (
          <>
            <p>Calendario</p>
          </>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
