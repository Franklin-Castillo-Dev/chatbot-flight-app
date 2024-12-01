import React, { useState } from "react";
import { Button, Card, CardFooter, Col, ListGroup, Row } from "react-bootstrap";
import { Chatbot } from "../../chatbot/Chatbot";
import FlightToast from "./FlightToast";

interface FlightListProps {
  flightList: any[];
  adults: number;
  travelClassSelected: string;
}

const FlightList: React.FC<FlightListProps> = ({
  flightList,
  adults,
  travelClassSelected,
}) => {
  const [showToast, setShowToast] = useState(false);

  // Crear el JSON para pasar al Chatbot
  const createChatbotData = () => {
    return flightList.map((flight: any, index: number) => {
      const flyListSegmentsDeparture = flight.itineraries?.[0]?.segments || [];
      const flyListSegmentsArrival = flight.itineraries?.[1]?.segments || [];

      return {
        flightNumber: `Vuelo ${index + 1}`, // Asigna un número de vuelo
        route: `Origen: ${
          flight.itineraries?.[0]?.segments?.[0]?.departure?.iataCode ||
          "No disponible"
        } → Destino: ${
          flight.itineraries?.[0]?.segments?.[
            flight.itineraries[0]?.segments.length - 1
          ]?.arrival?.iataCode || "No disponible"
        }`,
        departureDate: flight.itineraries?.[0]?.segments?.[0]?.departure?.at
          ? new Date(
              flight.itineraries[0].segments[0].departure.at
            ).toLocaleDateString()
          : "No disponible",
        returnDate: flight.itineraries?.[1]?.segments?.[0]?.departure?.at
          ? new Date(
              flight.itineraries[1].segments[0].departure.at
            ).toLocaleDateString()
          : "No disponible",
        outboundRoute: {
          numberOfStops: flyListSegmentsDeparture.length,
          segments: flyListSegmentsDeparture.map((segment: any) => ({
            departure: segment.departure?.iataCode || "No disponible",
            arrival: segment.arrival?.iataCode || "No disponible",
            departureTime: new Date(segment.departure?.at).toLocaleTimeString(),
            arrivalTime: new Date(segment.arrival?.at).toLocaleTimeString(),
          })),
        },
        returnRoute: {
          numberOfStops: flyListSegmentsArrival.length,
          segments: flyListSegmentsArrival.map((segment: any) => ({
            departure: segment.departure?.iataCode || "No disponible",
            arrival: segment.arrival?.iataCode || "No disponible",
            departureTime: new Date(segment.departure?.at).toLocaleTimeString(),
            arrivalTime: new Date(segment.arrival?.at).toLocaleTimeString(),
          })),
        },
        duration: flight.itineraries?.[0]?.duration || "No disponible",
        airline:
          flight.itineraries?.[0]?.segments?.[0]?.carrierCode ||
          "No disponible",
        travelClass: travelClassSelected,
        price: `${flight.price?.total || "No disponible"} ${
          flight.price?.currency || "No disponible"
        }`,
        numAdults: adults, // Incluye el número de adultos
      };
    });
  };

  // Función para agregar vuelo al localStorage
  const handleScheduleFlight = (flight: any) => {
    // Obtener vuelos previos del localStorage, si existen
    const storedFlights = JSON.parse(
      localStorage.getItem("scheduledFlights") || "[]"
    );

    // Agregar el nuevo vuelo al array
    storedFlights.push(flight);

    // Guardar el array actualizado en localStorage
    localStorage.setItem("scheduledFlights", JSON.stringify(storedFlights));

    console.log("storedFlights", storedFlights);

    // Mostrar el Toast
    setShowToast(true);

    // Ocultar el Toast después de 3 segundos
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="mt-4">
      <h3 className="text-center mb-4">Vuelos Encontrados</h3>
      {flightList.length === 0 ? (
        <div className="text-center text-muted">
          <p>No se han encontrado vuelos.</p>
        </div>
      ) : (
        <>
          <Chatbot flightData={createChatbotData()} />
          <div className="d-flex flex-wrap justify-content-center gap-4">
            {flightList.map((flight: any, flightIndex: number) => {
              const flyListSegmentsDepature =
                flight.itineraries?.[0]?.segments || [];
              const flyListSegmentsArrival =
                flight.itineraries?.[1]?.segments || [];
              const origin =
                flight.itineraries?.[0]?.segments?.[0]?.departure?.iataCode;
              const destination =
                flight.itineraries?.[0]?.segments?.[
                  flight.itineraries[0]?.segments.length - 1
                ]?.arrival?.iataCode;
              const departureDate = flight.itineraries?.[0]?.segments?.[0]
                ?.departure?.at
                ? new Date(
                    flight.itineraries[0].segments[0].departure.at
                  ).toLocaleDateString()
                : "No disponible";
              const returnDate = flight.itineraries?.[1]?.segments?.[0]
                ?.departure?.at
                ? new Date(
                    flight.itineraries[1].segments[0].departure.at
                  ).toLocaleDateString()
                : "No disponible";
              const skyscannerUrl = `https://www.skyscanner.net/transport/flights/${origin}/${destination}/241206/241212/?adultsv2=${adults}&cabinclass=economy&childrenv2=&inboundaltsenabled=false&outboundaltsenabled=false&preferdirects=false&ref=home&rtn=1`;

              return (
                <Card
                  key={flightIndex}
                  style={{ width: "24rem" }}
                  className="mb-1"
                >
                  <Card.Header className="bg-primary text-white">
                    Vuelo {flightIndex + 1}
                  </Card.Header>
                  <Card.Body>
                    <Card.Title className="text-center">
                      {origin} → {destination}
                    </Card.Title>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Fecha de Salida:</strong> {departureDate}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Fecha de Regreso:</strong> {returnDate}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>
                          Ruta de Salida: (No. Escala:
                          {" " + flyListSegmentsDepature.length})
                        </strong>
                        <ul className="mb-0">
                          {flyListSegmentsDepature.map(
                            (segment: any, index: number) => (
                              <li key={index}>
                                {segment.departure?.iataCode || "No disponible"}{" "}
                                →{segment.arrival?.iataCode || "No disponible"}{" "}
                                (
                                {new Date(
                                  segment.departure?.at
                                ).toLocaleTimeString()}{" "}
                                →{" "}
                                {new Date(
                                  segment.arrival?.at
                                ).toLocaleTimeString()}
                                )
                              </li>
                            )
                          )}
                        </ul>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>
                          Ruta de Regreso: (No. Escala:
                          {" " + flyListSegmentsArrival.length})
                        </strong>
                        <ul className="mb-0">
                          {flyListSegmentsArrival.map(
                            (segment: any, index: number) => (
                              <li key={index}>
                                {segment.departure?.iataCode || "No disponible"}{" "}
                                →{segment.arrival?.iataCode || "No disponible"}{" "}
                                (
                                {new Date(
                                  segment.departure?.at
                                ).toLocaleTimeString()}{" "}
                                →{" "}
                                {new Date(
                                  segment.arrival?.at
                                ).toLocaleTimeString()}
                                )
                              </li>
                            )
                          )}
                        </ul>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Duración:</strong>{" "}
                        {flight.itineraries?.[0]?.duration || "No disponible"}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Aerolínea:</strong>{" "}
                        {flight.itineraries?.[0]?.segments?.[0]?.carrierCode ||
                          "No disponible"}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Adultos:</strong> {adults || "No disponible"}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Clase:</strong>{" "}
                        {travelClassSelected || "No disponible"}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Precio:</strong>{" "}
                        {flight.price?.total + " " + flight.price?.currency ||
                          "No disponible"}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                  <CardFooter>
                    <div className="d-flex justify-content-between mt-3">
                      <Button
                        variant="warning"
                        onClick={() => window.open(skyscannerUrl, "_blank")}
                      >
                        Ver en Skyscanner
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() =>
                          handleScheduleFlight(createChatbotData()[flightIndex])
                        }
                      >
                        Agendar Vuelo
                      </Button>
                      {/* Componente Toast */}
                      <FlightToast
                        show={showToast}
                        onClose={() => setShowToast(false)}
                      />
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export { FlightList };
