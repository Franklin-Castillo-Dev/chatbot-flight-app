import React, { useState } from "react";
import { Button, Form, Row, Col, Card, Spinner } from "react-bootstrap";
import { AirportModal } from "./AirportModal";

interface FlightSearchFormProps {
  origin: string;
  setOrigin: (value: string) => void;
  destination: string;
  setDestination: (value: string) => void;
  adults: number;
  setAdults: (value: number) => void;
  departureDate: string;
  setDepartureDate: (value: string) => void;
  returnDate: string;
  setReturnDate: (value: string) => void;
  travelClass: string;
  setTravelClass: (value: string) => void;
  nonStop: string;
  setNonStop: (value: string) => void;
  fetchFlights: () => void;
  loading: boolean;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  origin,
  setOrigin,
  destination,
  setDestination,
  adults,
  setAdults,
  departureDate,
  setDepartureDate,
  returnDate,
  setReturnDate,
  travelClass,
  setTravelClass,
  nonStop,
  setNonStop,
  fetchFlights,
  loading,
}) => {
  const [showModalOrigin, setShowModalOrigin] = useState<boolean>(false);
  const [showModalDestination, setShowModalDestination] =
    useState<boolean>(false);

  return (
    <>
      <Card className="p-4 shadow-sm mx-4 mt-3">
        <h3 className="text-center mb-4">Busca tu Vuelo</h3>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="origin">
                <Form.Label>Ciudad de Origen (Formato IATA)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej. SAL"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="outline-primary"
                onClick={() => setShowModalOrigin(true)}
                className="mt-2"
              >
                Seleccionar Origen
              </Button>
            </Col>
            <Col md={6}>
              <Form.Group controlId="destination">
                <Form.Label>Ciudad de Destino (Formato IATA)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej. MEX"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="outline-primary"
                onClick={() => setShowModalDestination(true)}
                className="mt-2"
              >
                Seleccionar Destino
              </Button>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="departureDate">
                <Form.Label>Fecha de Salida</Form.Label>
                <Form.Control
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="returnDate">
                <Form.Label>Fecha de Regreso</Form.Label>
                <Form.Control
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="adults">
                <Form.Label>Cantidad de Adultos (Max 9)</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={9}
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  onBlur={() => {
                    if (adults > 9) setAdults(9);
                    if (adults < 1) setAdults(1);
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="travelClass">
                <Form.Label>Clase de Vuelo</Form.Label>
                <Form.Select
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                >
                  <option value="ECONOMY">Económica</option>
                  <option value="PREMIUM_ECONOMY">Económica Premium</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">Primera Clase</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="nonStop">
                <Form.Label>¿Permitir Escalas?</Form.Label>
                <Form.Select
                  value={nonStop}
                  onChange={(e) => setNonStop(e.target.value)}
                >
                  <option value="false">Sí</option>
                  <option value="true">No</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <div className="text-center mt-4">
              <Button
                onClick={fetchFlights}
                variant="success"
                disabled={loading}
                size="lg"
              >
                {loading ? "Consultando..." : "Buscar Vuelos"}
              </Button>
            </div>
          </Row>
          <div className="text-center mt-4">
            {loading ? <Spinner animation="border" variant="primary" /> : ""}
          </div>
        </Form>
      </Card>

      {/* Modal para seleccionar aeropuerto */}
      <AirportModal
        showModal={showModalOrigin}
        setShowModal={setShowModalOrigin}
        setOrigin={setOrigin}
      />

      {/* Modal para seleccionar aeropuerto */}
      <AirportModal
        showModal={showModalDestination}
        setShowModal={setShowModalDestination}
        setOrigin={setDestination}
      />
    </>
  );
};

export { FlightSearchForm };
