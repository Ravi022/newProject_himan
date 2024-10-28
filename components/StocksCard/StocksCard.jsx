"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function TotalStocksCard() {
  const [packedStocks, setPackedStocks] = useState("");
  const [unpackedStocks, setUnpackedStocks] = useState("");
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");

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

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/production/stocks/update",
        { packedStocks, unpackedStocks },
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
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Total Stocks
        </CardTitle>
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
