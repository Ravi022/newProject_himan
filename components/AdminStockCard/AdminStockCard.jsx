"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast for notifications
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Package, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const StockItem = ({ title, value, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg">
      <Icon className="h-6 w-6 text-muted-foreground" />
      <h3 className="text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

const StockCard = () => {
  const [date, setDate] = useState(new Date());
  const [stockData, setStockData] = useState({
    totalStocks: 0,
    packedStocks: 0,
    unpackedStocks: 0,
  });
  const [error, setError] = useState("");

  const fetchStockData = async (selectedDate) => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("Access token not found. Please log in again.");
      return;
    }

    const payload = {
      date: selectedDate.getDate(),
      month: selectedDate.getMonth() + 1,
      year: selectedDate.getFullYear(),
    };

    try {
      const response = await axios.post(
        "https://kooviot.vercel.app/admin/stocks/retrieve",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const { packedStocks, unpackedStocks, totalStocks } =
          response.data.data;

        if (
          packedStocks == null &&
          unpackedStocks == null &&
          totalStocks == null
        ) {
          // Set 0 for all fields if no data is found
          setStockData({ packedStocks: 0, unpackedStocks: 0, totalStocks: 0 });
          toast.warn("No stock data found for the selected date.");
        } else {
          // Set the actual values if data is found
          setStockData({ packedStocks, unpackedStocks, totalStocks });
          toast.success("Stocks data retrieved successfully");
        }
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to retrieve stocks data. Please try again."
      );
      toast.error(
        error.response?.data?.message ||
          "Failed to retrieve stocks data. Please try again."
      );
    }
  };

  // Fetch data for the current date on initial load
  useEffect(() => {
    fetchStockData(date);
  }, []);

  // Handle date selection and fetch data for the selected date
  const handleDateChange = (newDate) => {
    setDate(newDate);
    fetchStockData(newDate);
  };

  return (
    <Card className="w-full max-w-7xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
        <CardTitle className="text-sm font-medium">Stock Overview</CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <StockItem
            title="Total Stocks"
            value={stockData.totalStocks}
            icon={Package}
          />
          <StockItem
            title="Packed Stocks"
            value={stockData.packedStocks}
            icon={Package}
          />
          <StockItem
            title="Unpacked Stocks"
            value={stockData.unpackedStocks}
            icon={PackageOpen}
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default StockCard;
