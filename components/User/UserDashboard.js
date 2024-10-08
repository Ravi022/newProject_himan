"use client";

import { useState, useCallback } from "react";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Target } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Sector,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock data
const salesManager = {
  name: "John Doe",
  area: "North America",
  totalTargetCompleted: 85,
};

const mockPerformanceData = {
  "2023-05-15": { assigned: 100, completed: 75 },
  "2023-05-16": { assigned: 120, completed: 90 },
  "2024-10-06": { assigned: 80, completed: 70 },
};

const COLORS = ["#0088FE", "#FF8042"];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Value ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

export default function SalesManagerDashboard() {
  const [date, setDate] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
  };

  const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
  const performanceData = mockPerformanceData[formattedDate] || {
    assigned: 0,
    completed: 0,
  };

  const pieChartData = [
    { name: "Completed", value: performanceData.completed },
    {
      name: "Remaining",
      value: performanceData.assigned - performanceData.completed,
    },
  ];

  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-foreground">
      {/* Left Section */}
      <div className="w-full md:w-1/3 p-6 border-r border-border">
        <Card>
          <CardHeader>
            <CardTitle>Sales Manager Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">{salesManager.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span>{salesManager.area}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-muted-foreground" />
              <span>
                Total Target Completed: {salesManager.totalTargetCompleted}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-2/3 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <div className="flex flex-row gap-5">
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
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline" // Same outline style as the calendar button
                  className={cn(
                    "justify-center text-left font-normal"
                  )}
                  onClick={() => console.log("Date submitted:", date)}
                >
                  Submit
                </Button>
              </PopoverTrigger>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Matrix</CardTitle>
              <CardDescription>Daily target completion</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Target Information</CardTitle>
              <CardDescription>For {formattedDate}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Assigned Target:</span>
                <span className="font-semibold">
                  {performanceData.assigned}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Completed Target:</span>
                <span className="font-semibold">
                  {performanceData.completed}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
