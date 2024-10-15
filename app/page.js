"use client";
import { useState } from "react";
import Header from "@/components/Header/Header";
import UserDashboard from "@/components/User/UserDashboard.js";
import OrderForm from "@/components/OrderForm/OrderForm";
import Loading from "./loading";

export default function page() {
  const handleSalespersonSelect = (salesperson) => {
    setSelectedSalesperson(salesperson);
  };

  const salesperson = localStorage.getItem("userDetails");
  const salesManager = JSON.parse(salesperson);

  return (
    <div className=" min-h-full w-full ">
      <Header saleperson={salesManager} />
      <UserDashboard salesManager={salesManager} />
      {/* <Loading /> */}
      {/* <OrderForm /> */}
    </div>
  );
}
