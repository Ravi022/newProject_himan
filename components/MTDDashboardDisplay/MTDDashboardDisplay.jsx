"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const formatNumber = (num) => {
  return new Intl.NumberFormat("en-US").format(num || 0);
};

const getPercentageChange = (current, previous) => {
  if (!previous || !current) return 0;
  return ((current - previous) / previous) * 100;
};

const PercentageChange = ({ value }) => {
  if (value === 0) return <MinusIcon className="h-4 w-4 text-gray-500" />;
  const Icon = value > 0 ? ArrowUpIcon : ArrowDownIcon;
  const color = value > 0 ? "text-green-500" : "text-red-500";
  return (
    <div className={`flex items-center ${color}`}>
      <Icon className="h-4 w-4 mr-1" />
      {Math.abs(value).toFixed(2)}%
    </div>
  );
};

function MetricCard({ label, current, previous }) {
  const percentageChange = getPercentageChange(current, previous);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatNumber(current)}</div>
      </CardContent>
    </Card>
  );
}

export default function MTDDashboardDisplay() {
  const { theme, setTheme } = useTheme();

  const currentData = {
    totalDispatch: 10000,
    production: 12000,
    packing: 11000,
    sales: 9500,
  };

  const previousData = {
    totalDispatch: 9500,
    production: 11500,
    packing: 10800,
    sales: 9000,
  };

  const metrics = [
    { key: "totalDispatch", label: "Total Dispatch MTD" },
    { key: "production", label: "Production MTD" },
    { key: "packing", label: "Packing MTD" },
    { key: "sales", label: "Sales MTD" },
  ];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">MTD Dashboard</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <Moon className="h-6 w-6" />
          ) : (
            <Sun className="h-6 w-6" />
          )}
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(({ key, label }) => (
          <MetricCard
            key={key}
            label={label}
            current={currentData[key]}
            previous={previousData[key]}
          />
        ))}
      </div>
    </div>
  );
}
