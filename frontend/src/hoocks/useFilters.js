import { useContext } from "react";
import { FiltersContext } from "../context/filters";

export function useFilters() {
  const { filters, setFilters } = useContext(FiltersContext);

  const filterProducts = (products) => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesPrice = product.price >= filters.minPrice;

      const matchesCategory =
        filters.category === "all" || product.category === filters.category;

      const normalize = (text) =>
        text
          ?.toString()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim() || "";

      const search = normalize(filters.searchTerm);
      const title = normalize(product.title);

      const matchesSearch = search === "" || title.includes(search);

      return matchesPrice && matchesCategory && matchesSearch;
    });
  };

  return { filters, filterProducts, setFilters };
}
