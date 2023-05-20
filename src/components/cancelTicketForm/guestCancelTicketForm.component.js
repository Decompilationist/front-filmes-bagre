import React, { useState, useContext } from "react";
import { MovieAPIContext } from "../../contexts/movie-api-provider";
import {
  Container,
  Button,
  Col,
  InputGroup,
  Card,
  Form,
} from "react-bootstrap";
import Ticket from "../ticket/ticket.component";

export default function GuestCancelTicketForm() {
  const { getTicketById } = useContext(MovieAPIContext);
  const [ticketId, setTicketId] = useState(null);
  const [ticket, setTicket] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const results = await getTicketById(ticketId);
    if (results) setTicket(results);
  }

  return (
    <Container>
      <Col
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "600px",
          marginTop: "2rem",
        }}
      >
        <h2 className="text-center">Cancelar um ingresso</h2>
        <Form onSubmit={handleSubmit}>
          <InputGroup className="m-2">
            <Form.Control
              type="text"
              placeholder="Digite o ID do ingresso fornecido no recibo"
              value={ticketId || ""}
              onChange={(e) => setTicketId(e.target.value)}
            />
            <Button variant="primary" type="submit">
              Buscar ingresso
            </Button>
          </InputGroup>
        </Form>
        {ticket == null ? (
          <Card className="p-2 m-2">
            <Card.Body>Insira um número de bilhete válido.</Card.Body>
          </Card>
        ) : ticket.length === 0 ? (
          <Card className="p-2 m-2">
            <Card.Body>Ingresso não encontrado.</Card.Body>
          </Card>
        ) : (
          <div>
            <Ticket ticket={ticket} />
          </div>
        )}
      </Col>
    </Container>
  );
}
