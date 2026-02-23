import React from "react";
import ProductListFromJson from "../Components/ProductList.jsx";
import "../Components/ProductList.css";
import ProductManager from "../Components/ProductManager.jsx";
import "../Components/ProductManager.css";
import ImageSearchAndCopy from "../Components/ImageSearch.jsx";
import "../Components/ImageSearch.css";
import Sidebar from "../Components/Sidebar.jsx";
import UserManager from "../Components/UserManager.jsx";
import InventoryEntry from "../Components/InventoryEntry.jsx";
import DashboardStats from "../Components/DashboardStats.jsx";
import { AdminOrders } from "./AdminOrders.jsx";
import "./prueba.css";

function Prueba() {
  return (
    <>
      <div className="contenedorprimario">
        <Sidebar></Sidebar>
        <DashboardStats></DashboardStats>
        <InventoryEntry></InventoryEntry>
        <ImageSearchAndCopy></ImageSearchAndCopy>
        {/* <ProductListFromJson></ProductListFromJson> */}
        <ProductManager></ProductManager>
        <UserManager></UserManager>
        <AdminOrders></AdminOrders>
      </div>
    </>
  );
}

export default Prueba;
