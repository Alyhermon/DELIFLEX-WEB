"use client";
import styles from "./login.module.css";
import DFInput from "@/app/components/components-items/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import DFCheckbox from "@/app/components/components-items/checkbox/checkbox";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const login = async () => {
    setLoading(true);
    setLoginError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.message || "No se pudo iniciar sesión");
        return;
      }

      await fetch("/api/auth/set-cookie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: data.access_token,
          maxAge: data.max_age_seconds,
        }),
      });

      // Navegacion dura, no router.push: fuerza a que useAuth() vuelva a
      // pedir /api/auth/me con la cookie ya puesta.
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setLoginError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Deliflex</h1>

        <div className={styles.input}>
          <DFInput
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setLoginError("");
            }}
            placeholder="ejemplo@email.com"
            icon={<FontAwesomeIcon color="#ed7b17" icon={faEnvelope} />}
          />

          <DFInput
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setLoginError("");
            }}
            placeholder="Contraseña"
            type="password"
            icon={<FontAwesomeIcon color="#ed7b17" icon={faKey} />}
            error={loginError}
          />

          <DFCheckbox
            label="Mantener sesión iniciada"
            checked={rememberMe}
            onChange={setRememberMe}
          />

          <button
            className={styles.loginButton}
            onClick={login}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
