import React from "react";
import { Link } from "react-router-dom";
// import "./Main.css";

// import imagen1 from "./Components/Img/Open Peeps - Avatar.png";
import imagen1 from "./Img/Avatar.png";

export const Menuprincipal = () => {
  return (
    <div className="el-caribeno">
      <div>
        <div className="HEADER-content">
          <div className="logo">
            <img src={imagen1} alt="Logo de El Caribeño" />

            <h1>El Caribeño</h1>
          </div>
          <nav>
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#about">Acerca de</a>
              </li>
              <li>
                <a href="#services">Servicios</a>
              </li>

              <li>
                <Link to="login" className="btn">
                  Ingresar
                </Link>
              </li>
              <li>
                <Link to="signup" className="btn">
                  Registrarce
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <main>
        <section id="home" className="hero">
          <div className="slider">
            <div className="slide"></div>
            <div className="slide"></div>
            <div className="slide"></div>
          </div>
          <div className="hero-content">
            <h2>Bienvenido a El Caribeño</h2>
            <p>Tu Tienda de Confianza</p>
            <Link to="/products" className="btn">
              Comenzar Búsqueda
            </Link>
          </div>
        </section>

        <section id="about" className="about">
          <div className="container about-content">
            <div className="about-image">
              <img src={imagen1} alt="Sobre nosotros" />
            </div>
            <div className="about-text">
              <h2>Acerca de</h2>
              <p>
                En El Caribeño, nos enorgullece ofrecer productos de la más alta
                calidad, seleccionados cuidadosamente para garantizar frescura y
                sabor en cada bocado porque creemos que la calidad es
                fundamental para una alimentación saludable y deliciosa. Ven y
                descubre la diferencia que hace un compromiso genuino con la
                excelencia en cada uno de nuestros productos.
              </p>
            </div>
          </div>
        </section>

        <section id="services" className="services">
          <div className="container">
            <h2>Nuestros Servicios</h2>
            <div className="services-grid">
              <div className="service-card">
                <i aria-hidden="true">🛒</i>
                <h3>Si Necesitas Comprar</h3>
                <p>Solo lo mejor para tu hogar.</p>
              </div>
              <div className="service-card">
                <i aria-hidden="true">🥩</i>
                <h3>La Mejor Carne</h3>
                <p>Solo lo mejor para la familia o fin de semana.</p>
              </div>
              <div className="service-card">
                <i aria-hidden="true">🍷</i>
                <h3>Licorería</h3>
                <p>Solo lo mejor para ti.</p>
              </div>
              <div className="service-card">
                <i aria-hidden="true">🚚</i>
                <h3>Entrega a domicilio</h3>
                <p>Siempre llegamos a ti.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-bottom">
        <div>
          <p>&copy; 2023 El Caribeño. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
