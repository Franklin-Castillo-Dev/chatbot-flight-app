import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown"; // Importamos el componente para renderizar markdown
import {
  Button,
  Modal,
  Form,
  InputGroup,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";

interface ChatbotProps {
  flightData: any; // Recibimos el JSON completo del vuelo
}

const Chatbot: React.FC<ChatbotProps> = ({ flightData }) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [
      {
        role: "system",
        content: `
              Eres un asistente experto en análisis de vuelos y recomendaciones turísticas. Tu objetivo es:
              1. Ayudar a los usuarios a elegir el mejor vuelo según sus necesidades, teniendo en cuenta la clase, el precio y la distancia.
              2. Recomendar lugares turísticos y sugerir itinerarios interesantes en el destino.
              3. Proporcionar consejos prácticos para su viaje, como sugerencias sobre fechas o filtros de búsqueda alternativos.
          
              En la primera consulta, si el usuario no menciona actividades turísticas, ofrece un resumen breve con algunas recomendaciones populares sobre el destino. 
              Si el usuario solicita más detalles, proporciona información más completa sobre actividades turísticas, itinerarios y otros lugares de interés.
          
              Utiliza el JSON del vuelo proporcionado para evaluar las opciones disponibles y sugerir actividades relacionadas con el destino. Además, asegúrate de indicar si el vuelo es adecuado o si sería conveniente realizar una nueva búsqueda con diferentes filtros o fechas.
          
              Mantén las respuestas claras y concisas al principio, extendiéndolas solo cuando el usuario lo solicite.
          
              JSON a analizar: ${JSON.stringify(flightData)}
            `,
      },
      {
        role: "assistant",
        content: `¡Bienvenido! Estás planeando un viaje hacia un destino lleno de maravillas turísticas. ¿Te gustaría saber más sobre las actividades que puedes hacer allí o prefieres analizar tu vuelo?`,
      },
    ]
  );

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const updatedMessages = [...messages, { role: "user", content: input }];
    setMessages(updatedMessages);
    setInput("");

    setLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: updatedMessages,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const assistantMessage = response.data.choices[0].message;
      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error("Error al comunicarse con la API de OpenAI:", error);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Hubo un error al procesar tu solicitud.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Row>
        <Col className="mx-5 mb-3">
          <Button variant="info" className="w-100" onClick={toggleModal}>
            Analizar con IA
          </Button>
        </Col>
      </Row>

      <Modal show={showModal} onHide={toggleModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chatbot de Análisis con OpenAI</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            className="chat-container"
            style={{ maxHeight: "60vh", overflowY: "auto" }}
          >
            {messages
              .filter((msg) => msg.role !== "system")
              .map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-3 p-3 rounded ${
                    msg.role === "user"
                      ? "bg-light text-end"
                      : "bg-secondary text-white"
                  }`}
                >
                  <strong>{msg.role === "user" ? "Tú" : "IA"}:</strong>{" "}
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Escribe tu mensaje aquí..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !loading && handleSendMessage()
              }
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={loading}
            >
              <i className="bi bi-send-fill"></i>
              {loading ? (
                <Spinner as="span" animation="border" size="sm" />
              ) : (
                "Enviar"
              )}
            </Button>
          </InputGroup>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export { Chatbot };
