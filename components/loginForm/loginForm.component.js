import React, { useState, useContext } from "react";
import "./loginForm.css";
import Alert from "react-bootstrap/Alert";
import { MovieAPIContext } from "../../contexts/movie-api-provider";

function LoginForm() {
  const { login } = useContext(MovieAPIContext);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loginResult, setLoginResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await login(email, password);
    setLoginResult(result);
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Entrar</h3>
          {loginResult != null && loginResult !== true && (
            <div className="d-grid mt-3">
              <Alert variant="danger">{loginResult}</Alert>
            </div>
          )}
          <div className="form-group mt-3">
            <label>Endereço de E-mail</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Digite seu e-mail"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Senha</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Digite sua senha"
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Enviar
            </button>
          </div>
          <div style={{ marginTop: "1rem" }}>
            Ainda não tem uma conta? <a href="/register">Se registre aqui</a>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
