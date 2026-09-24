"use client";

import { useState } from "react";
import styles from "./auth-modal.module.css";
import DFInput from "@/app/components/components-items/input";
import DFCheckbox from "@/app/components/components-items/checkbox/checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faKey,
  faUser,
  faPhone,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

type Mode = "login" | "register";

type Props = {
  onClose: () => void;
};

const FORM_VACIO = { username: "", email: "", phone: "", password: "" };

// El padre solo monta este componente mientras el modal esta abierto (ver
// header.tsx: `{showAuthModal && <AuthModal .../>}`) - así, cada vez que se
// vuelve a abrir es una instancia nueva, sin arrastrar lo que se escribió
// (o el error) la vez anterior, sin necesitar un effect para resetear.
export default function AuthModal({ onClose }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [registro, setRegistro] = useState(FORM_VACIO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const entrarConToken = async (token: string, maxAgeSeconds?: number) => {
    await fetch("/api/auth/set-cookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, maxAge: maxAgeSeconds }),
    });

    // Navegacion dura: useAuth() vive en un hook que solo pide /api/auth/me
    // al montar, asi que un simple cierre de modal no se entera de la
    // cookie nueva hasta refrescar.
    window.location.reload();
  };

  const login = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "No se pudo iniciar sesión");
        return;
      }

      await entrarConToken(data.access_token, data.max_age_seconds);
    } catch (err) {
      console.error(err);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const registrarse = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registro),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "No se pudo crear la cuenta");
        return;
      }

      await entrarConToken(data.access_token);
    } catch (err) {
      console.error(err);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") login();
    else registrarse();
  };

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className={styles.card}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          disabled={loading}
          aria-label="Cerrar"
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <h2 className={styles.title}>Deliflex</h2>
        <p className={styles.subtitle}>
          {mode === "login" ? "Inicia sesión para pedir" : "Crea tu cuenta para pedir"}
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <DFInput
                value={registro.username}
                onChange={(e) =>
                  setRegistro((prev) => ({ ...prev, username: e.target.value }))
                }
                placeholder="Nombre de usuario"
                icon={<FontAwesomeIcon color="#ed7b17" icon={faUser} />}
              />
              <DFInput
                value={registro.phone}
                onChange={(e) =>
                  setRegistro((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="Teléfono"
                icon={<FontAwesomeIcon color="#ed7b17" icon={faPhone} />}
              />
            </>
          )}

          <DFInput
            value={mode === "login" ? email : registro.email}
            onChange={(e) =>
              mode === "login"
                ? setEmail(e.target.value)
                : setRegistro((prev) => ({ ...prev, email: e.target.value }))
            }
            placeholder="ejemplo@email.com"
            icon={<FontAwesomeIcon color="#ed7b17" icon={faEnvelope} />}
          />

          <DFInput
            value={mode === "login" ? password : registro.password}
            onChange={(e) =>
              mode === "login"
                ? setPassword(e.target.value)
                : setRegistro((prev) => ({ ...prev, password: e.target.value }))
            }
            placeholder="Contraseña"
            type="password"
            icon={<FontAwesomeIcon color="#ed7b17" icon={faKey} />}
            error={error}
          />

          {mode === "login" && (
            <DFCheckbox
              label="Mantener sesión iniciada"
              checked={rememberMe}
              onChange={setRememberMe}
            />
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading
              ? "Cargando..."
              : mode === "login"
                ? "Iniciar sesión"
                : "Crear cuenta"}
          </button>
        </form>

        <p className={styles.switchMode}>
          {mode === "login" ? (
            <>
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                className={styles.switchModeBtn}
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
              >
                Regístrate
              </button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                className={styles.switchModeBtn}
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                Inicia sesión
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
