"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
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
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header/Header";
import TargetHistory from "@/components/ShowAssignTargetToAdmin/TargetHistory";
import ConfirmationSlider from "@/components/ConfirmationSlider/ConfirmationSlider.jsx";

// Mock data
const salespeople = [
  { name: "Ravikumar N", jobId: "KIOL2238", area: "Bangalore" },
  { name: "Sugumar R", jobId: "KIOL2236", area: "Chennai, TN" },
  { name: "Vineesh Mehta", jobId: "KIOL2239", area: "Delhi" },
  { name: "Soma Naveen Chandra", jobId: "KIOL2070", area: "Hyderabad" },
  { name: "Bharat Lal Dubey", jobId: "KIOL2064", area: "Maharashtra" },
  { name: "Sushila Shaw", jobId: "KIOL2225", area: "Kolkata" },
  { name: "Ardhendu Aditya", jobId: "KIOL2234", area: "Kolkata" },
];

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
  const [selectedSalesperson, setSelectedSalesperson] = useState(
    salespeople[0]
  );
  const [targetValue, setTargetValue] = useState("");
  const [canAssignTasks, setCanAssignTasks] = useState();

  const fetchPermissionStatus = async () => {
    const token = localStorage.getItem("accessToken"); // Retrieve the Bearer token from local storage
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/admin/canSalespersonAddTasks",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the Bearer token to the headers
          },
        }
      );
      if (response.status === 200) {
        setCanAssignTasks(response.data.canAssignTasks);
        console.log("canAssignTasks :", response.data.canAssignTasks);
      }
    } catch (error) {
      console.error("Error fetching permission status:", error);
    }
  };
  // Fetch salesperson's permission status
  useEffect(() => {
    fetchPermissionStatus();
  }, []); // Fetch on component mount

  const handleSalespersonSelect = (value) => {
    setSelectedSalesperson(salespeople.find((sp) => sp.name === value));
  };

  const handleTargetAssign = async () => {
    const token = localStorage.getItem("accessToken"); // Retrieve the Bearer token from local storage
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/admin/monthlyTarget",
        {
          target: parseInt(targetValue, 10), // Convert string to number
          jobId: selectedSalesperson.jobId, // Include jobId in the payload
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the Bearer token to the headers
          },
        }
      );

      if (response.status === 200) {
        alert(
          `Successfully assigned target of ${targetValue} for ${selectedSalesperson.name}`
        );
        setTargetValue(""); // Clear the input after successful assignment
      }
    } catch (error) {
      console.error("Error assigning target:", error);
      alert("Failed to assign target. Please try again.");
    }
  };

  return (
    <div>
      <Header saleperson={{ name: "Admin", jobId: "ADMIN001" }} />
      <div className="container mx-auto p-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ConfirmationSlider
            initialPermission={canAssignTasks}
            fetchPermissionStatus={fetchPermissionStatus}
          />
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
          <TargetHistory />
        </div>

        {/* Display Can Assign Tasks */}
        <div className="my-4">
          <Card>
            <CardHeader>
              <CardTitle>Salesperson Task Permission</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                {canAssignTasks
                  ? "Salesperson is allowed to add tasks."
                  : "Salesperson is not allowed to add tasks."}
              </p>
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
