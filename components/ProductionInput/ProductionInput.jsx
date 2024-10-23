"use client";

import { useState } from "react";
import axios from "axios";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ProductionInput() {
  const { theme, setTheme } = useTheme();
  const [formData, setFormData] = useState({
    totalDispatch: "",
    production: "",
    packing: "",
    sales: "",
  });

  const [message, setMessage] = useState(null); // For showing success/error message
  const [error, setError] = useState(null); // For error messages

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (field) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const mtdTypeMapping = {
        totalDispatch: "dispatchMtd",
        production: "productionMtd",
        packing: "packingMtd",
        sales: "salesMtd",
      };

      const payload = {
        mtdType: mtdTypeMapping[field],
        value: formData[field],
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/production/mtd/update",
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Handle success
      if (response.data) {
        window.alert(`Success: ${response.data.message}`);
        setMessage(`Success: ${response.data.message}`);
        setError(null); // Clear any previous errors
      }
    } catch (err) {
      // Handle error
      window.alert(
        `Error: ${err.response?.data?.message || "An error occurred"}`
      );
      setError(err.response?.data?.message || "An error occurred");
      setMessage(null); // Clear any previous success message
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">MTD Data Input</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Success and Error Messages */}
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        {Object.entries({
          totalDispatch: "Total Dispatch MTD Today",
          production: "Production MTD Today",
          packing: "Packing MTD Today",
          sales: "Sales MTD Today",
        }).map(([key, label]) => (
          <div key={key} className="grid sm:grid-cols-3 gap-2 items-center">
            <Label htmlFor={key} className="sm:text-right">
              {label}
            </Label>
            <div className="sm:col-span-2 flex space-x-2">
              <Input
                type="number"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                className="flex-grow"
              />
              <Button onClick={() => handleSubmit(key)}>Submit</Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
