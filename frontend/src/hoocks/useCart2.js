import { useState, useEffect } from "react";
import initialProducts from "../mocks/products.json";

export function useCart() {
  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState([]);

  useEffect(() => {
    setProducts(initialProducts);
  }, []);

  const getProducts = () => products;

  const addProduct = (newProductData) => {
    const newId =
      products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const productToAdd = {
      ...newProductData,
      id: newId,
      price: parseFloat(newProductData.price),
      thumbnail: newProductData.thumbnail || "https://via.placeholder.com/150",
    };
    setProducts((prevProducts) => [...prevProducts, productToAdd]);
    return productToAdd;
  };

  const updateProduct = (updatedProductData) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProductData.id
          ? {
              ...updatedProductData,
              price: parseFloat(updatedProductData.price),
            }
          : product,
      ),
    );
  };

  const deleteProduct = (id) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== id),
    );
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
      ),
    );
  };

  return {
    products,
    cart,
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateQuantity,
  };
}
