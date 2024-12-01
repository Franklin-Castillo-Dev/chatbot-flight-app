import { Outlet } from "react-router-dom";
import { NavBarFlight } from "../../components/navbar/Navbar";

function AppShell() {
  return (
    <>
      <NavBarFlight></NavBarFlight>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export { AppShell };
