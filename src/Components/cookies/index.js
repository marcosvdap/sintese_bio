import { useState, useEffect } from "react";
import styles from "./cookies.module.css"; // 👈 Importa o CSS Module

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      // Adiciona um pequeno atraso para não "pular" na cara do usuário
      const timer = setTimeout(() => {
        setVisible(true);
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    // Aplica as classes do CSS Module
    <div className={styles.cookieBanner}>
      <p className={styles.cookieText}>
        Usamos cookies para melhorar sua experiência. Ao continuar navegando,
        você aceita nossa política de cookies.
      </p>
      <div className={styles.buttonGroup}>
        <button onClick={handleAccept} className={styles.btnAccept}>
          Aceitar
        </button>
        <button onClick={handleReject} className={styles.btnReject}>
          Rejeitar
        </button>
      </div>
    </div>
  );
}