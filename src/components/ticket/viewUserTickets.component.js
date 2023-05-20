import React, { useContext, useState, useEffect } from "react";
import Ticket from "./ticket.component";
import { Container, Col, Card } from "react-bootstrap";
import { MovieAPIContext } from "../../contexts/movie-api-provider";

export default function viewUserTickets() {
  const { getTicketsForCurrentUser } = useContext(MovieAPIContext);
  const [tickets, setTickets] = useState(null);

  useEffect(() => {
    async function fetchTickets() {
      const results = await getTicketsForCurrentUser();
      setTickets(results);
    }
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <h2 className="text-center">Todos os seus ingressos estão listados abaixo:</h2>
        {tickets == null ? (
          <Card>
            <Card.Body>Carregando...</Card.Body>
          </Card>
        ) : tickets.length === 0 ? (
          <Card>
            <Card.Body>Você não possuí tickets a serem exibidos.</Card.Body>
          </Card>
        ) : (
          tickets.map((t) => {
            // console.log(t.ticket_id);
            return <Ticket ticket={t} key={t.ticket_id} />;
          })
        )}
      </Col>
    </Container>
  );
}
