"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header/Header";


export default function page() {
  const [jobId, setJobId] = useState("");
  const [area, setArea] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic form validation
    if (!jobId || !area || !name) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically make an API call to add the new user
    console.log("New user submitted:", { jobId, area, name });

    // Show success message
    toast({
      title: "Success",
      description: "New user added successfully",
    });

    // Reset form after successful submission
    setJobId("");
    setArea("");
    setName("");
  };

  return (
    <div className="flex flex-col gap-40">
      <div className="">
        <Header />
      </div>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
          <CardDescription>Enter the details of the new user</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobId">Job ID</Label>
              <Input
                id="jobId"
                placeholder="Enter Job ID"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Area</Label>
              <Input
                id="area"
                placeholder="Enter Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Add User
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
