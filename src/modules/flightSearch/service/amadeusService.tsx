import axios from "axios";

const amadeusApiUrl = "https://test.api.amadeus.com/v2/";

// Función para obtener el token de acceso
export const getAccessToken = async (): Promise<string | null> => {
  const apiKey = import.meta.env.VITE_AMADEUS_API_KEY;
  const apiSecret = import.meta.env.VITE_AMADEUS_API_SECRET;

  try {
    const response = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: apiKey,
        client_secret: apiSecret,
      })
    );
    //console.log("token obtenido: ", response.data.access_token);
    return response.data.access_token;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error al obtener el token:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error desconocido al obtener el token:", error);
    }
    return null;
  }
};

export const fetchFlightsFromAmadeus = async (
  origin: string,
  destination: string,
  departureDate: string,
  returnDate: string,
  adults: number,
  travelClass: string,
  nonStop: string,
  token: string
): Promise<any | null> => {
  try {
    //console.log("token Utilizado: ", token);
    const flightResponse = await axios.get(
      `${amadeusApiUrl}shopping/flight-offers`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate,
          returnDate,
          adults,
          children: 0,
          travelClass,
          nonStop: nonStop === "true" ? "true" : "false",
          max: 10,
          currencyCode: "USD",
        },
      }
    );
    return flightResponse.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error al obtener los vuelos de Amadeus:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error desconocido al obtener los vuelos:", error);
    }
    return null;
  }
};
