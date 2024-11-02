import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const MetricCard = ({ title, todayValue, mtdValue, info }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        {title}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="ml-1">
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{info}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{mtdValue.toLocaleString()}</div>
      <p className="text-xs text-muted-foreground">Month-to-Date</p>
      <div className="mt-4 text-lg font-semibold">
        {todayValue.toLocaleString()}
      </div>
      <p className="text-xs text-muted-foreground">Today</p>
    </CardContent>
  </Card>
);

const AdminMetricsDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [metrics, setMetrics] = useState({
    "Total Dispatch": { today: 0, mtd: 0 },
    Production: { today: 0, mtd: 0 },
    Packing: { today: 0, mtd: 0 },
    Sales: { today: 0, mtd: 0 },
  });

  const fetchMetrics = async (date) => {
    const year = date.getFullYear();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await axios.post(
        "https://new-project-backend.vercel.app/admin/mtd/values",
        { year, month, day },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (response.status === 200) {
        const data = response.data;
        console.log("Response data:", data);

        setMetrics({
          "Total Dispatch": {
            today: data?.dayReport?.totaldispatch || 0,
            mtd: data?.monthReportTillDate?.totaldispatch || 0,
          },
          Production: {
            today: data?.dayReport?.production || 0,
            mtd: data?.monthReportTillDate?.production || 0,
          },
          Packing: {
            today: data?.dayReport?.packing || 0,
            mtd: data?.monthReportTillDate?.packing || 0,
          },
          Sales: {
            today: data?.dayReport?.sales || 0,
            mtd: data?.monthReportTillDate?.sales || 0,
          },
        });
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error.message || error);
    }
  };

  useEffect(() => {
    fetchMetrics(selectedDate);
  }, [selectedDate]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    fetchMetrics(date);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Metrics Overview</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[240px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Production"
          todayValue={metrics.Production.today}
          mtdValue={metrics.Production.mtd}
          info="Number of items produced"
        />
        <MetricCard
          title="Packing"
          todayValue={metrics.Packing.today}
          mtdValue={metrics.Packing.mtd}
          info="Number of items packed"
        />
        <MetricCard
          title="Total Dispatch"
          todayValue={metrics["Total Dispatch"].today}
          mtdValue={metrics["Total Dispatch"].mtd}
          info="Number of items dispatched"
        />

        <MetricCard
          title="Sales"
          todayValue={metrics.Sales.today}
          mtdValue={metrics.Sales.mtd}
          info="Total sales amount in dollars"
        />
      </div>
    </div>
  );
};

export default AdminMetricsDashboard;
