import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid"; // Importar el plugin para la vista semanal
import listPlugin from "@fullcalendar/list"; // Importar el plugin de lista

import { EventInput } from "@fullcalendar/core";
import { Modal, Button, ListGroup, Card } from "react-bootstrap";
import esLocale from "@fullcalendar/core/locales/es"; // Importar la localización en español

const FlightCalendar: React.FC = () => {
  const [flights, setFlights] = useState<EventInput[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Obtener vuelos previos desde localStorage
    const storedFlights = JSON.parse(
      localStorage.getItem("scheduledFlights") || "[]"
    );

    // Función para convertir la fecha en formato DD/MM/YYYY a un objeto Date
    const parseDate = (date: string) => {
      const [day, month, year] = date.split("/");
      return new Date(Number(year), Number(month) - 1, Number(day));
    };

    // Función para convertir la hora en formato hh:mm:ss AM/PM a un objeto Date
    const parseTime = (date: Date, time: string) => {
      const [hour, minute, second] = time
        .replace(/[^0-9:]/g, "")
        .split(":")
        .map(Number);
      const isPM = time.toLowerCase().includes("p.m.");
      const adjustedHour = isPM ? (hour % 12) + 12 : hour % 12;

      // Crear una nueva instancia de Date con la hora ajustada
      const newDate = new Date(date);
      newDate.setHours(adjustedHour, minute, second || 0);
      return newDate;
    };

    // Mapear vuelos a eventos para FullCalendar
    const flightEvents = storedFlights.map((flight: any) => {
      const departureDate = flight.departureDate
        ? parseDate(flight.departureDate)
        : null;

      // Obtener la hora del primer segmento del itinerario de ida
      const firstSegment = flight.outboundRoute?.segments[0];
      const startDateTime =
        departureDate && firstSegment
          ? parseTime(departureDate, firstSegment.departureTime)
          : null;

      return {
        title: flight.flightNumber,
        start: startDateTime ? startDateTime.toISOString() : "", // Formato ISO válido para FullCalendar
        description: flight.route || "No disponible",
        color: "#4CAF50",
        extendedProps: {
          route: flight.route,
          departureDate: flight.departureDate,
          returnDate: flight.returnDate,
          outboundRoute: flight.outboundRoute,
          returnRoute: flight.returnRoute,
          duration: flight.duration,
          airline: flight.airline,
          travelClass: flight.travelClass,
          price: flight.price,
          numAdults: flight.numAdults,
        },
      };
    });

    setFlights(flightEvents);
  }, []);

  // Función para abrir el modal con la información del vuelo
  const handleEventClick = (eventInfo: any) => {
    setSelectedFlight(eventInfo.event.extendedProps);
    setShowModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Función para vaciar el localStorage
  const clearLocalStorage = () => {
    localStorage.removeItem("scheduledFlights");
    setFlights([]); // Limpiar la lista de vuelos también
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Vuelos Agendados</h2>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]} // Agregar listPlugin
          initialView="dayGridMonth"
          events={flights}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek", // Añadir vistas
          }}
          contentHeight="auto"
          dayHeaderClassNames="text-center"
          eventClassNames="small-event"
          eventClick={handleEventClick}
          locale={esLocale} // Establecer el idioma a español
        />
      </div>

      <Button
        variant="danger"
        onClick={clearLocalStorage}
        style={{ marginBottom: "20px" }}
      >
        Limpiar todas mis Reservas
      </Button>

      {/* Modal con la información del vuelo */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Vuelo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFlight ? (
            <div>
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Información del Vuelo</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Vuelo:</strong> {selectedFlight.flightNumber}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Ruta:</strong> {selectedFlight.route}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Fecha de salida:</strong>{" "}
                      {selectedFlight.departureDate}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Fecha de regreso:</strong>{" "}
                      {selectedFlight.returnDate}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Aerolínea:</strong> {selectedFlight.airline}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Clase de viaje:</strong>{" "}
                      {selectedFlight.travelClass}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Duración:</strong> {selectedFlight.duration}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Precio:</strong> {selectedFlight.price}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Adultos:</strong> {selectedFlight.numAdults}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>

              {/* Itinerario de vuelo de ida */}
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Itinerario de Ida</Card.Title>
                  {selectedFlight.outboundRoute?.segments.map(
                    (segment: any, index: number) => (
                      <ListGroup key={index} variant="flush">
                        <ListGroup.Item>
                          <strong>Parada {index + 1}:</strong>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Salida:</strong> {segment.departure} a las{" "}
                          {segment.departureTime}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Llegada:</strong> {segment.arrival} a las{" "}
                          {segment.arrivalTime}
                        </ListGroup.Item>
                      </ListGroup>
                    )
                  )}
                </Card.Body>
              </Card>

              {/* Itinerario de vuelo de regreso */}
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Itinerario de Regreso</Card.Title>
                  {selectedFlight.returnRoute?.segments.map(
                    (segment: any, index: number) => (
                      <ListGroup key={index} variant="flush">
                        <ListGroup.Item>
                          <strong>Parada {index + 1}:</strong>
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Salida:</strong> {segment.departure} a las{" "}
                          {segment.departureTime}
                        </ListGroup.Item>
                        <ListGroup.Item>
                          <strong>Llegada:</strong> {segment.arrival} a las{" "}
                          {segment.arrivalTime}
                        </ListGroup.Item>
                      </ListGroup>
                    )
                  )}
                </Card.Body>
              </Card>
            </div>
          ) : (
            <p>Cargando...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FlightCalendar;
