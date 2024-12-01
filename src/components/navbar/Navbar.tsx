import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function NavBarFlight() {
  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary"
      bg="dark"
      data-bs-theme="dark"
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          JourneyCraft
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              className={`me-lg-3 ${location.pathname === "/" ? "active" : ""}`}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/calendar"
              className={`me-lg-3 ${
                location.pathname === "/calendar" ? "active" : ""
              }`}
            >
              Calendario
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export { NavBarFlight };
