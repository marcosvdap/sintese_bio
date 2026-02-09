// src/Components/ScrollToTop.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // 🔝 volta pro topo sempre que o pathname mudar
  }, [pathname]);

  return null;
}
