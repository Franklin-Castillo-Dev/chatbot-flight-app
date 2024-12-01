import React from "react";
import { Toast } from "react-bootstrap";
import logo from "../../../assets/logo.webp";

interface FlightToastProps {
  show: boolean;
  onClose: () => void;
}

const FlightToast: React.FC<FlightToastProps> = ({ show, onClose }) => {
  return (
    <Toast
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
      }}
      show={show}
      onClose={onClose}
      delay={3000}
      autohide
    >
      <Toast.Header>
        {/* Imagen con clase 'rounded-circle' para hacerlo redondeado y tamaño pequeño */}
        <img
          src={logo}
          className="rounded-circle me-2"
          alt="Logo"
          style={{ width: "30px", height: "30px" }} // Tamaño pequeño
        />
        <strong className="me-auto">JourneyCraft</strong>
      </Toast.Header>
      <Toast.Body>Vuelo agendado con éxito!</Toast.Body>
    </Toast>
  );
};

export default FlightToast;
