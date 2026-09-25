"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import type { User } from "@/app/types/user";
import DFInput from "@/app/components/components-items/input";
import Toast from "@/app/components/components-items/toast/toast";
import Breadcrumb from "@/app/components/layout/breadcrumb";
import styles from "./editar.module.css";

export default function EditarPerfilPage() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading || !user) {
    return <div className={styles.page} />;
  }

  return <EditarPerfilForm user={user} />;
}

// Separado del componente de arriba para que username/phone arranquen ya
// con el valor real del usuario (useState solo lee su valor inicial una
// vez) - este componente no se monta hasta que useAuth() ya resolvio, asi
// que no hace falta un effect para "corregir" el valor despues.
function EditarPerfilForm({ user }: { user: User }) {
  const [username, setUsername] = useState(user.username ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(
    null,
  );

  const guardarPerfil = async () => {
    setSavingProfile(true);
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.message || "No se pudo actualizar el perfil", type: "error" });
        return;
      }

      setToast({ message: "Perfil actualizado.", type: "success" });
      // Recarga dura: el circulo con las iniciales en el header y el
      // nombre en esta misma pantalla salen de useAuth(), que solo pide
      // /api/auth/me una vez al montar - sin esto se quedan con el nombre
      // viejo hasta que alguien refresque a mano.
      setTimeout(() => window.location.reload(), 800);
    } catch (error) {
      console.error(error);
      setToast({ message: "Error de conexión", type: "error" });
    } finally {
      setSavingProfile(false);
    }
  };

  const cambiarPassword = async () => {
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch("/api/auth/update-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.message || "No se pudo actualizar la contraseña");
        return;
      }

      setToast({ message: "Contraseña actualizada.", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      setPasswordError("Error de conexión");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className="page-container">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/" },
            { label: "Mi Perfil", href: "/cuenta" },
            { label: "Editar Perfil" },
          ]}
        />
        <h1 className={styles.title}>Editar Perfil</h1>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Información personal</p>
          <p className={styles.cardHint}>Así te van a ver en Deliflex.</p>

          <div className={styles.form}>
            <DFInput
              label="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre"
            />
            <DFInput
              label="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Tu teléfono"
            />
            <button
              type="button"
              className={styles.saveBtn}
              onClick={guardarPerfil}
              disabled={savingProfile || !username.trim()}
            >
              {savingProfile ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <p className={styles.cardTitle}>Cambiar contraseña</p>
          <p className={styles.cardHint}>Usa una contraseña de al menos 6 caracteres.</p>

          <div className={styles.form}>
            <DFInput
              label="Contraseña actual"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Contraseña actual"
            />
            <DFInput
              label="Nueva contraseña"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
            />
            <DFInput
              label="Confirmar nueva contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la nueva contraseña"
              error={passwordError}
            />
            <button
              type="button"
              className={styles.saveBtn}
              onClick={cambiarPassword}
              disabled={savingPassword || !currentPassword || !newPassword}
            >
              {savingPassword ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
