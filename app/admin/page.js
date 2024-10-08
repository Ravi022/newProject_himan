"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Header from "@/components/Header/Header";

// Mock data
const salespeople = [
  { name: "Bharat Lal Dubey", jobId: "SP001", area: "North India" },
  { name: "Soma Naveen Chandra", jobId: "SP002", area: "South India" },
  { name: "Sugumar R", jobId: "SP003", area: "East India" },
  { name: "Vineesh Mahta", jobId: "SP004", area: "West India" },
  { name: "Ravi Kumar N", jobId: "SP005", area: "Central India" },
  { name: "Sushila Shav", jobId: "SP006", area: "Northeast India" },
  { name: "Raunak Kalal", jobId: "SP007", area: "Northwest India" },
];

const mockTargetData = {
  "2023-05-15": { total: 1000, pending: 400, completed: 600 },
  "2023-05-16": { total: 1200, pending: 500, completed: 700 },
  "2023-05-17": { total: 800, pending: 300, completed: 500 },
};

const mockBarChartData = [
  { name: "Bharat Lal Dubey", completed: 75, pending: 25 },
  { name: "Soma Naveen Chandra", completed: 60, pending: 40 },
  { name: "Sugumar R", completed: 80, pending: 20 },
  { name: "Vineesh Mahta", completed: 70, pending: 30 },
  { name: "Ravi Kumar N", completed: 65, pending: 35 },
  { name: "Sushila Shav", completed: 85, pending: 15 },
  { name: "Raunak Kalal", completed: 55, pending: 45 },
];

export default function TargetAssignmentDashboard() {
  const [date, setDate] = useState(new Date());
  const [selectedSalesperson, setSelectedSalesperson] = useState(
    salespeople[0]
  );
  const [targetValue, setTargetValue] = useState("");

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleSalespersonSelect = (value) => {
    setSelectedSalesperson(salespeople.find((sp) => sp.name === value));
  };

  const handleTargetAssign = () => {
    console.log(
      `Assigned target ${targetValue} to ${selectedSalesperson.name}`
    );
    setTargetValue("");
  };

  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  const targetData = mockTargetData[formattedDate] || {
    total: 0,
    pending: 0,
    completed: 0,
  };

  return (
    <div>
      {" "}
      <Header />
      <div className="container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Assign Target</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select onValueChange={handleSalespersonSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Salesperson" />
                </SelectTrigger>
                <SelectContent>
                  {salespeople.map((sp) => (
                    <SelectItem key={sp.jobId} value={sp.name}>
                      {sp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedSalesperson && (
                <div className="space-y-2">
                  <p>
                    <strong>Job ID:</strong> {selectedSalesperson.jobId}
                  </p>
                  <p>
                    <strong>Area Coverage:</strong> {selectedSalesperson.area}
                  </p>
                </div>
              )}
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Enter target value"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                />
                <Button onClick={handleTargetAssign}>Assign</Button>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Total Assign Target */}
          <Card>
            <CardHeader>
              <CardTitle>Total Assign Target</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
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
                    initialFocus
                    onSelect={handleDateSelect}
                    fromYear={2020}
                    toYear={2025}
                    showMonthYearPicker
                  />
                </PopoverContent>
              </Popover>
              <div className="space-y-2">
                <p>
                  <strong>Total Assigned Targets:</strong> {targetData.total}
                </p>
                <p>
                  <strong>Pending Targets:</strong> {targetData.pending}
                </p>
                <p>
                  <strong>Completed Targets:</strong> {targetData.completed}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 3: Bar Chart (Target vs Salesperson) */}
        <Card>
          <CardHeader>
            <CardTitle>Target vs Salesperson</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={mockBarChartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="completed"
                  stackId="a"
                  fill="#8884d8"
                  name="Completed Targets"
                />
                <Bar
                  dataKey="pending"
                  stackId="a"
                  fill="#82ca9d"
                  name="Pending Targets"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
