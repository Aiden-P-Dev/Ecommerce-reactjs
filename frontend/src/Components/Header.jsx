import { Filters } from "./Filters.jsx";
import "./Header.css";
import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="Header">
      <div className="Banner">
        {/* <div className="hero">
          
        </div> */}
        <Link to="/" className="Hero">
          <div className="clip">
            <img src="src\Components\Img\LogoCari.png" alt="" />
          </div>
          <h1>El Caribeño</h1>
        </Link>
      </div>

      <Filters />
    </header>
  );
}
