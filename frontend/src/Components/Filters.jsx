import { useState, useEffect } from "react";
import { useFilters } from "../hoocks/useFilters";
import { Cart } from "./Cart.jsx";
import { supabase } from "../lib/supabaseClient.js";
import "./Filters.css";

export function Filters() {
  const { filters, setFilters } = useFilters();
  const [categories, setCategories] = useState([]);

  // Cargar categorías dinámicas desde Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("productos")
          .select("category");

        if (error) throw error;

        if (data) {
          // Extraer solo los nombres únicos de las categorías
          const uniqueCategories = [
            ...new Set(data.map((item) => item.category).filter(Boolean)),
          ];

          // Ordenarlas alfabéticamente para que el menú sea profesional
          setCategories(uniqueCategories.sort());
        }
      } catch (err) {
        console.error("Error obteniendo categorías:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      searchTerm: event.target.value,
    }));
  };

  const handleChangeCategory = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      category: event.target.value,
    }));
  };

  return (
    <section className="filters">
      <div className="cart_div">
        <Cart />
      </div>

      <div className="input__container">
        <div className="shadow__input">
          <input
            type="text"
            className="input__search"
            placeholder="BUSCAR PRODUCTO..."
            value={filters.searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="filter_div">
        <label>Categoría</label>

        <select onChange={handleChangeCategory} value={filters.category}>
          <button>
            <span class="picker">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="48px"
                viewBox="0 -960 960 960"
                width="48px"
                fill="#FFFFFF"
              >
                <path d="M480-344 240-584l43-43 197 197 197-197 43 43-240 240Z" />
              </svg>
            </span>
            <selectedcontent value="all">Todo</selectedcontent>
          </button>

          {categories.map((categoryName) => (
            <option key={categoryName} value={categoryName}>
              {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
