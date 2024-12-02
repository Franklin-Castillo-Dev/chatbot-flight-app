import React, { useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { getAccessToken, searchAirportOrCity } from "../service/amadeusService";

interface AirportModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  setOrigin: (value: string) => void;
}

const AirportModal: React.FC<AirportModalProps> = ({
  showModal,
  setShowModal,
  setOrigin,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [airportList, setAirportList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    setLoading(true);
    const token = await getAccessToken();

    if (token) {
      const airports = await searchAirportOrCity(selectedCity, token);
      setAirportList(airports?.data || []);
    } else {
      setAirportList([]);
    }

    setLoading(false);
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Selecciona Aeropuerto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="citySearch">
            <Form.Label>Ciudad o Aeropuerto</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese una ciudad o aeropuerto"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            />
          </Form.Group>
          <Button
            variant="primary"
            className="mt-3"
            onClick={handleSearch}
            disabled={!selectedCity || loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Buscando...
              </>
            ) : (
              "Buscar"
            )}
          </Button>
        </Form>
        {airportList.length > 0 && (
          <Form.Group controlId="selectAirport" className="mt-3">
            <Form.Label>Resultados</Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => {
                const selectedAirport = airportList.find(
                  (airport) => airport.iataCode === e.target.value
                );
                setOrigin(selectedAirport.iataCode);
              }}
            >
              <option value="">Seleccione un aeropuerto</option>
              {airportList.map((airport) => (
                <option key={airport.id} value={airport.iataCode}>
                  {airport.name} ({airport.iataCode})
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export { AirportModal };
