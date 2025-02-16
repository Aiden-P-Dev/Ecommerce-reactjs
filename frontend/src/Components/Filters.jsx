import { useId } from "react";
import "./Filters.css";
import { useFilters } from "../hoocks/useFilters";
import { Cart } from "./Cart.jsx";
import "./Barrabusqueda.css";

export function Filters() {
  const { filters, setFilters } = useFilters();

  const minPriceFilterId = useId();
  const categoryFilterId = useId();
  const searchFilterId = useId();

  const handleChangeCategory = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      category: event.target.value,
    }));
  };

  const handleSearch = (event) => {
    setFilters((prevState) => ({
      ...prevState,
      searchTerm: event.target.value,
    }));
  };

  return (
    <section className="filters">
      <div>
        <Cart />
      </div>
      <div className="input__container">
        <div className="shadow__input">
          <input
            id={searchFilterId}
            type="text"
            className="input__search"
            placeholder="QUE NECESITAS"
            value={filters.searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div>
        <label htmlFor={categoryFilterId}>Categorías</label>
        <select id={categoryFilterId} onChange={handleChangeCategory}>
          <option value="all">Todo</option>
          <option value="alimento">Alimentos</option>
          <option value="condimento">Condimentos</option>
          <option value="higiene">Higiene</option>
          <option value="alcohol">Bebidas</option>
          <option value="charcuteria">Charcuteria</option>
        </select>
      </div>
    </section>
  );
}
