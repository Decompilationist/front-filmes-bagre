import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { MovieAPIContext } from "../../contexts/movie-api-provider";

const AppNavbar = () => {
  const { isLoggedIn } = useContext(MovieAPIContext);
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Bagre Movies</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/movies">Filmes</Nav.Link>
            <Nav.Link href="/cancel">Cancelar</Nav.Link>
          </Nav>
          {!isLoggedIn ? (
            <Nav>
              <Nav.Link href="/login">Entrar</Nav.Link>
              <Nav.Link href="/register">Cadastro</Nav.Link>
            </Nav>
          ) : (
            <Nav>
              <Nav.Link href="/profile">Perfil</Nav.Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default AppNavbar;
