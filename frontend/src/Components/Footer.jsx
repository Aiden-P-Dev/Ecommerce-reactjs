import { useCart } from "../hoocks/useCart";
import { useFilters } from "../hoocks/useFilters";
import "./Footer.css";

export function Footer() {
  const { filters } = useFilters();

  return (
    <footer className="footer">
      <a>Ayuda</a>
    </footer>
  );
}
