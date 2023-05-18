import React, { useContext, useState } from "react";
import "./registerForm.css";
import Alert from "react-bootstrap/Alert";
import { MovieAPIContext } from "../../contexts/movie-api-provider";

function RegisterForm() {
  const { register } = useContext(MovieAPIContext);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [address, setAddress] = useState();
  const [cc, setCC] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [registerResult, setRegisterResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await register(
      firstName,
      lastName,
      address,
      cc,
      email,
      password
    );
    setRegisterResult(result);
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Cadastrar</h3>
          {registerResult === true ? (
            <Alert variant="success">
              Cadastrado com sucesso. Por favor, faça o login.
            </Alert>
          ) : (
            registerResult != null && (
              <Alert variant="danger">{registerResult}</Alert>
            )
          )}
          <div className="form-group mt-3">
            <label>Nome</label>
            <input
              className="form-control mt-1"
              placeholder="Fulano"
              value={firstName || ""}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Sobrenome</label>
            <input
              className="form-control mt-1"
              placeholder="Santos"
              value={lastName || ""}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Endereço</label>
            <input
              className="form-control mt-1"
              placeholder="371 Santo Amaro, São Paulo, SP"
              value={address || ""}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Cartão de Crédito</label>
            <input
              className="form-control mt-1"
              placeholder="1111 2222 3333 4444"
              value={cc || ""}
              onChange={(e) => setCC(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Endereço de E-mail</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="fulano@gmail.com"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Senha</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Ex. 12345678"
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Enviar
            </button>
          </div>
          <div style={{ marginTop: "30px" }}>
            Já possui uma conta? <a href="/login">Logue aqui</a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
