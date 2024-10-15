"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col md:flex-row bg-background text-foreground">
      {/* Left Section */}
      <div className="w-full md:w-2/3 p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <div className="w-[240px]">
            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>

          {/* Target Information Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Target Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/3 p-6 border-r border-border">
        <div className="flex flex-col gap-5">
          {/* Sales Manager Details Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Manager Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-5 w-[200px]" />
            </CardContent>
          </Card>

          {/* Task Manager Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Task Manager</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
