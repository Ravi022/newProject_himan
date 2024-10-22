"use client";

import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const salespeople = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Bob Johnson" },
];

const mockTasks = {
  completed: [
    "Finalized contract with ABC Corp for $500,000 annual subscription",
    "Conducted product demo for XYZ Inc, resulting in a successful upsell of premium features",
    "Completed quarterly sales report and presented findings to management team",
    "Finalized contract with ABC Corp for $500,000 annual subscription",
  ],
  incomplete: [
    "Follow up with potential client DEF Ltd regarding their interest in our enterprise solution",
    "Prepare proposal for GHI Co's custom integration requirements",
    "Schedule meeting with JKL Corp to discuss renewal options and potential upgrades",
  ],
  extra: [
    "Attended industry conference and networked with 15 potential leads",
    "Contributed to the development of new sales strategies for Q3",
    "Mentored junior sales representative in closing techniques and objection handling",
  ],
};

const TaskList = ({ tasks, title }) => (
  <div className="space-y-2">
    <h3 className="text-lg font-semibold capitalize">{title}</h3>
    <ul className="space-y-2">
      {tasks.map((task, index) => (
        <li key={index} className="flex items-start space-x-2">
          <span className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
          <span className="text-sm">{task}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default function AdminTasks() {
  const [date, setDate] = useState(new Date());
  const [selectedSalesperson, setSelectedSalesperson] = useState("");

  const handleSubmit = () => {
    console.log("Submitted:", { date, selectedSalesperson });
    // Here you would typically fetch tasks based on the selected date and salesperson
  };

  return (
    <div className="container mx-auto p-4 ">
      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="w-full lg:w-auto">
          <CardHeader>
            <CardTitle>Select Date and Salesperson</CardTitle>
            <CardDescription>
              Choose a date and salesperson to view tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
            <Select onValueChange={setSelectedSalesperson}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select salesperson" />
              </SelectTrigger>
              <SelectContent>
                {salespeople.map((person) => (
                  <SelectItem key={person.id} value={person.id}>
                    {person.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSubmit} className="w-full">
              Submit
            </Button>
          </CardContent>
        </Card>

        <Card className="flex-grow">
          <CardHeader>
            <CardTitle>Tasks Overview</CardTitle>
            <CardDescription>
              Completed, Incomplete, and Extra Tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(mockTasks).map(([category, tasks]) => (
                <ScrollArea
                  key={category}
                  className="h-[calc(100vh-30rem)] pr-4"
                >
                  <TaskList tasks={tasks} title={`${category} Tasks`} />
                </ScrollArea>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
