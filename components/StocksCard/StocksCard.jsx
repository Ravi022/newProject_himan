"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import "react-datepicker/dist/react-datepicker.css";

export default function TotalStocksCard() {
  const [packedStocks, setPackedStocks] = useState("");
  const [unpackedStocks, setUnpackedStocks] = useState("");
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get normalized date components from the selected date
  const getNormalizedDate = () => {
    const year = selectedDate.getFullYear().toString();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = selectedDate.getDate().toString().padStart(2, "0");

    return { year, month, day };
  };

  // Update total stocks whenever packed or unpacked stocks change
  useEffect(() => {
    const packed = parseInt(packedStocks) || 0;
    const unpacked = parseInt(unpackedStocks) || 0;

    if (packedStocks !== "" && isNaN(packed)) {
      setError("Please enter a valid number for packed stocks.");
    } else if (unpackedStocks !== "" && isNaN(unpacked)) {
      setError("Please enter a valid number for unpacked stocks.");
    } else {
      setError("");
      setTotal(packed + unpacked);
    }
  }, [packedStocks, unpackedStocks]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Access token not found. Please log in again.");
      return;
    }

    // Get normalized date values from the selected date
    const { year, month, day } = getNormalizedDate();

    try {
      const response = await axios.post(
        "https://new-project-backend.vercel.app/production/stocks/update",
        {
          year,
          month,
          day,
          packedStocks: parseInt(packedStocks) || 0,
          unpackedStocks: parseInt(unpackedStocks) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Stocks updated successfully");
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update stocks. Please try again."
      );
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
        <CardTitle className="text-2xl font-bold text-center">
          Total Stocks
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Label htmlFor="date-picker">Select Date:</Label>
          <DatePicker
            id="date-picker"
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            className="border rounded p-2"
            dateFormat="MMMM d, yyyy"
          />
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="packed-stocks">Packed Stocks</Label>
            <Input
              id="packed-stocks"
              type="number"
              placeholder="Enter packed stocks"
              value={packedStocks}
              onChange={(e) => setPackedStocks(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="unpacked-stocks">Unpacked Stocks</Label>
            <Input
              id="unpacked-stocks"
              type="number"
              placeholder="Enter unpacked stocks"
              value={unpackedStocks}
              onChange={(e) => setUnpackedStocks(e.target.value)}
            />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold">Total Stocks:</p>
            <p className="text-3xl font-bold text-primary">{total}</p>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
