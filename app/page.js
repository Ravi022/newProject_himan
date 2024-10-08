"use client";
import { useState } from "react";
import Header from "@/components/Header/Header";
import UserDashboard from "@/components/User/UserDashboard";

export default function page() {
  const handleSalespersonSelect = (salesperson) => {
    setSelectedSalesperson(salesperson);
  };

  const salepersonName = "Abc";

  return (
    <div className=" min-h-full w-full ">
      {/* Pass dummy props to Header */}
      <Header
        onSalespersonSelect={handleSalespersonSelect}
        salepersonName="ABC"
      />

      <UserDashboard />
    </div>
  );
}
