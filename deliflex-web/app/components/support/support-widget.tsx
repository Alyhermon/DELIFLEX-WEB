"use client";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faXmark,
  faPaperPlane,
  faHourglassHalf,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/app/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import styles from "./support-widget.module.css";

type Ticket = {
  id: string;
  subject: string;
  message: string;
  status: "NUEVO" | "EN_PROGRESO" | "FINALIZADO";
  created_at: string;
  updated_at: string;
};

const STATUS_META: Record<Ticket["status"], { label: string; icon: typeof faPaperPlane }> = {
  NUEVO: { label: "Enviado, en espera de respuesta", icon: faPaperPlane },
  EN_PROGRESO: { label: "El equipo de soporte lo está atendiendo", icon: faHourglassHalf },
  FINALIZADO: { label: "Resuelto por el equipo de soporte", icon: faCircleCheck },
};

const formatHora = (iso: string) =>
  new Date(iso).toLocaleString("es-DO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

// Mismo chat de soporte que ChatHomeScreen en la app movil (tickets reales
// via get_my_support_tickets/create_support_ticket), pero como ventanita
// flotante en vez de una pantalla completa - Rexie (la burbuja animada con
// recomendaciones) es otra cosa aparte, esto es el canal real con el
// equipo de soporte.
export default function SupportWidget() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const loadTickets = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc("get_my_support_tickets", {
        p_customer_id: user.id,
      });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setTickets(data ?? []);
      setLoading(false);
    };

    loadTickets();
  }, [open, user]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight });
  }, [tickets]);

  const handleSend = async () => {
    const text = message.trim();
    if (!text || !user || sending) return;

    setSending(true);
    const subject = text.length > 60 ? `${text.slice(0, 60)}…` : text;

    const { error } = await supabase.rpc("create_support_ticket", {
      p_customer_id: user.id,
      p_subject: subject,
      p_message: text,
    });

    if (error) {
      console.error(error);
      setSending(false);
      return;
    }

    setMessage("");
    const { data } = await supabase.rpc("get_my_support_tickets", {
      p_customer_id: user.id,
    });
    setTickets(data ?? []);
    setSending(false);
  };

  return (
    <div className={styles.wrapper}>
      {open && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <span>Soporte Deliflex</span>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setOpen(false)}
              aria-label="Cerrar chat de soporte"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <div className={styles.messages} ref={messagesRef}>
            {!user && (
              <p className={styles.empty}>Inicia sesión para escribirle a soporte.</p>
            )}

            {loading && user && <p className={styles.empty}>Cargando...</p>}

            {!loading && user && tickets.length === 0 && (
              <p className={styles.empty}>
                ¿Tienes un problema o pregunta? Escríbenos abajo y el equipo de
                Deliflex te responderá lo antes posible.
              </p>
            )}

            {tickets.map((ticket) => {
              const meta = STATUS_META[ticket.status];

              return (
                <div className={styles.ticketBlock} key={ticket.id}>
                  <div className={styles.bubble}>
                    <p>{ticket.message}</p>
                    <span className={styles.bubbleTime}>
                      {formatHora(ticket.created_at)}
                    </span>
                  </div>
                  <div className={styles.statusRow}>
                    <FontAwesomeIcon icon={meta.icon} />
                    <span>{meta.label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <form
            className={styles.composer}
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <textarea
              className={styles.input}
              placeholder="Escribe tu mensaje a soporte..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!user || sending}
              rows={1}
            />
            <button
              type="submit"
              className={styles.sendButton}
              disabled={!message.trim() || sending || !user}
              aria-label="Enviar mensaje"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      )}

      {!open && (
        <button
          type="button"
          className={styles.fab}
          onClick={() => setOpen(true)}
          aria-label="Abrir chat de soporte"
        >
          <FontAwesomeIcon icon={faComments} />
        </button>
      )}
    </div>
  );
}
