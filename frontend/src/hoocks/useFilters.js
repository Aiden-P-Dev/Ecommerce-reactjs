import { useContext } from "react";
import { FiltersContext } from "../context/filters";

export function useFilters() {
  const { filters, setFilters } = useContext(FiltersContext);

  const filterProducts = (products) => {
    return products.filter((product) => {
      const matchesMinPrice = product.price >= filters.minPrice;
      const matchesCategory =
        filters.category === "all" || product.category === filters.category;

      let matchesSearch = true;
      if (filters.searchTerm && filters.searchTerm !== "") {
        const searchTerm = filters.searchTerm.toLowerCase();
        const title = (product.title || "").toLowerCase();
        const category = (product.category || "").toLowerCase();
        matchesSearch =
          title.includes(searchTerm) || category.includes(searchTerm);
      }

      return matchesMinPrice && matchesCategory && matchesSearch;
    });
  };

  return { filters, filterProducts, setFilters };
}
