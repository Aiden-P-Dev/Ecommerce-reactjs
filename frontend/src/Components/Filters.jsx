import { useFilters } from "../hoocks/useFilters";
import { Cart } from "./Cart.jsx";
import "./Filters.css";

export function Filters() {
  const { filters, setFilters } = useFilters();

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
          <option value="all">Todo</option>
          <option value="alimento">Alimentos</option>
          <option value="charcuteria">Charcutería</option>
        </select>
      </div>
    </section>
  );
}
