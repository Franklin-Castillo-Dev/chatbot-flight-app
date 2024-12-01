import React, { useState } from "react";

import { AirportModal } from "../components/AirportModal";
import { FlightList } from "../components/FlightList";
import { FlightSearchForm } from "../components/FlightSearchForm";
import {
  fetchFlightsFromAmadeus,
  getAccessToken,
} from "../service/amadeusService";

const FlightSearchShell: React.FC = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [adults, setAdults] = useState(1);
  const [adultsSearch, setAdultsSearch] = useState(1);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [travelClass, setTravelClass] = useState("ECONOMY");
  const [travelClassSearch, setTravelClassSearch] = useState("ECONOMY");
  const [nonStop, setNonStop] = useState("false");
  const [loading, setLoading] = useState(false);
  const [flightList, setFlightList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [airportList, setAirportList] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>("");

  const fetchFlights = async () => {
    setLoading(true);
    setFlightList([]);

    let token = accessToken; // Usa el estado actual
    if (!token) {
      console.log("Esperando el token...");
      token = await getAccessToken(); // Si no hay token, lo obtenemos primero
      if (token) {
        console.log("Token Válido.");
        setAccessToken(token); // Actualizamos el estado para futuras llamadas
      } else {
        console.error("No se pudo obtener un token válido.");
        setLoading(false);
        return;
      }
    }

    // Llamar a la API de Amadeus con el token
    const flights = await fetchFlightsFromAmadeus(
      origin,
      destination,
      departureDate,
      returnDate,
      adults,
      travelClass,
      nonStop,
      token // Usamos el token actualizado
    );

    //console.log(flights);
    if (flights) {
      setAdultsSearch(adults);
      setTravelClassSearch(travelClass);
      setFlightList(flights.data); // Actualiza la lista de vuelos con la respuesta de la API
    } else {
      setFlightList([]);
    }
    setLoading(false);
  };

  return (
    <>
      <FlightSearchForm
        origin={origin}
        setOrigin={setOrigin}
        destination={destination}
        setDestination={setDestination}
        adults={adults}
        setAdults={setAdults}
        departureDate={departureDate}
        setDepartureDate={setDepartureDate}
        returnDate={returnDate}
        setReturnDate={setReturnDate}
        travelClass={travelClass}
        setTravelClass={setTravelClass}
        nonStop={nonStop}
        setNonStop={setNonStop}
        fetchFlights={fetchFlights}
        loading={loading}
      />
      <FlightList
        flightList={flightList}
        adults={adultsSearch}
        travelClassSelected={travelClassSearch}
      />
      <AirportModal
        showModal={showModal}
        setShowModal={setShowModal}
        airportList={airportList}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        setOrigin={setOrigin}
        setDestination={setDestination}
      />
    </>
  );
};

export { FlightSearchShell };
