import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

interface AirportModalProps {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  airportList: any[];
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  setOrigin: (value: string) => void;
  setDestination: (value: string) => void;
}

const AirportModal: React.FC<AirportModalProps> = ({
  showModal,
  setShowModal,
  airportList,
  selectedCity,
  setSelectedCity,
  setOrigin,
  setDestination,
}) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Selecciona Aeropuerto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="selectAirport">
            <Form.Label>Aeropuerto en {selectedCity}</Form.Label>
            <Form.Control
              as="select"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setOrigin(e.target.value);
                setDestination(e.target.value);
              }}
            >
              {airportList.map((airport, index) => (
                <option key={index} value={airport.name}>
                  {airport.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
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
