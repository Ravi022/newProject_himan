import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import axios from "axios";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const salesPersons = [
  { id: "SP001", name: "Ravikumar N", jobId: "KIOL2238", area: "Bangalore" },
  { id: "SP002", name: "Sugumar R", jobId: "KIOL2236", area: "Chennai, TN" },
  { id: "SP003", name: "Vineesh Mehta", jobId: "KIOL2239", area: "Delhi" },
  {
    id: "SP004",
    name: "Soma Naveen Chandra",
    jobId: "KIOL2070",
    area: "Hyderabad",
  },
  {
    id: "SP005",
    name: "Bharat Lal Dubey",
    jobId: "KIOL2064",
    area: "Maharashtra",
  },
  { id: "SP006", name: "Sushila Shaw", jobId: "KIOL2225", area: "Kolkata" },
  { id: "SP007", name: "Ardhendu Aditya", jobId: "KIOL2234", area: "Kolkata" },
];

export default function TargetHistory() {
  const [date, setDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState("");
  const [targetData, setTargetData] = useState({
    totalAssignedTarget: 0,
    totalCompletedTarget: 0,
    totalPendingTarget: 0,
  });

  const handleMonthSelect = (monthIndex) => {
    const newDate = new Date(date.getFullYear(), monthIndex, 1);
    setDate(newDate);
    setIsOpen(false);
    fetchTargetData(monthIndex + 1, date.getFullYear()); // Month is 0-indexed, so add 1
  };

  const handleYearChange = (increment) => {
    const newDate = new Date(
      date.getFullYear() + increment,
      date.getMonth(),
      1
    );
    setDate(newDate);
  };

  const fetchTargetData = async (month, year) => {
    const token = localStorage.getItem("accessToken"); // Retrieve the Bearer token from local storage
    const selectedPerson = salesPersons.find(
      (sp) => sp.id === selectedSalesPerson
    );

    if (selectedPerson) {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/admin/monthlyStats",
          {
            jobId: selectedPerson.jobId,
            month: month.toString(), // Convert month to string
            year: year.toString(), // Convert year to string
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the Bearer token to the headers
            },
          }
        );

        // Update targetData with the response data
        setTargetData({
          totalAssignedTarget: response.data.totalAssignedTarget,
          totalCompletedTarget: response.data.totalCompletedTarget,
          totalPendingTarget: response.data.totalPendingTarget,
        });
      } catch (error) {
        console.error("Error fetching target data:", error);
        alert("Failed to fetch target data. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (selectedSalesPerson) {
      fetchTargetData(date.getMonth() + 1, date.getFullYear()); // Fetch data when salesperson is selected
    }
  }, [selectedSalesPerson, date]);

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Sales Person Target Assignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "MMMM yyyy") : <span>Pick a month</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleYearChange(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous year</span>
                </Button>
                <div className="text-sm font-medium">
                  {format(date, "yyyy")}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleYearChange(1)}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next year</span>
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <Button
                    key={month}
                    variant="outline"
                    className={cn(
                      "h-9 w-full",
                      date.getMonth() === index &&
                        "bg-primary text-primary-foreground"
                    )}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month}
                  </Button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Select onValueChange={setSelectedSalesPerson}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a salesperson" />
          </SelectTrigger>
          <SelectContent>
            {salesPersons.map((sp) => (
              <SelectItem key={sp.id} value={sp.id}>
                {sp.name} (Job ID: {sp.jobId})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-y-2">
          <p>
            <strong>Total Assigned Targets:</strong>{" "}
            ₹{targetData.totalAssignedTarget}
          </p>
          <p>
            <strong>Pending Targets:</strong> ₹{targetData.totalPendingTarget}
          </p>
          <p>
            <strong>Completed Targets:</strong>{" "}
            ₹{targetData.totalCompletedTarget}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
