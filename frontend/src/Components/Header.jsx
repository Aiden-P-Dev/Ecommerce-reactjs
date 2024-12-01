import { Filters } from "./Filters.jsx";
import "./Header.css";
import { Link } from "react-router-dom";

import imagen2 from "./Img/LogoCari.png";
// C:\Users\user\Desktop\Practicas Pequeñas Definitive Edition\React\Programa_principalV9 este es para subirlo aunque sea server local\frontend\src\Components\Img\LogoCari.png.png

export function Header() {
  return (
    <header className="Header">
      <div className="Banner">
        {/* <div className="hero">
          
        </div> */}
        <Link to="/" className="Hero">
          <div className="clip">
            <img src={imagen2} alt="" />
          </div>
          <h1>El Caribeño</h1>
        </Link>
      </div>

      <Filters />
    </header>
  );
}
