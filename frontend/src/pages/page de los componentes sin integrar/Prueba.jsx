import React from "react";
import ProductListFromJson from "../component/ProductList";
import ProductManager from "../component/CrudReact";
import ImageSearchAndCopy from "../component/ImageSearch";

function Prueba() {
  return (
    <>
      <ImageSearchAndCopy></ImageSearchAndCopy>
      <ProductListFromJson></ProductListFromJson>
      <ProductManager></ProductManager>
    </>
  );
}

export default Prueba;
