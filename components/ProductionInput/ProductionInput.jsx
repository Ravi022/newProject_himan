import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Info } from "lucide-react";

const categories = [
  { name: "Total Dispatch", info: "Total number of items dispatched" },
  { name: "Production", info: "Total number of items produced" },
  { name: "Packing", info: "Total number of items packed" },
  { name: "Sales", info: "Total sales amount in dollars" },
];

const ProductionInput = () => {
  const [metrics, setMetrics] = useState({});

  const handleInputChange = (category, value) => {
    setMetrics((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmit = async (category) => {
    const value = metrics[category];
    if (value && !isNaN(Number(value))) {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const currentDate = new Date();
        const response = await axios.post(
          "https://kooviot.vercel.app/production/mtd/update",
          {
            year: currentDate.getFullYear().toString(),
            month: currentDate.toLocaleString("default", { month: "long" }),
            day: currentDate.getDate().toString().padStart(2, "0"),
            mtdType: category.toLowerCase().replace(" ", ""),
            value: Number(value),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 200) {
          toast.success(`${category} - Today metric updated successfully!`, {
            position: "bottom-right",
            autoClose: 2000,
          });
          setMetrics((prev) => ({
            ...prev,
            [category]: "",
          }));
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "An error occurred while updating.",
          {
            position: "bottom-right",
            autoClose: 2000,
          }
        );
      }
    } else {
      toast.error("Please enter a valid number", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <TooltipProvider>
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <div key={category.name} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{category.info}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`${category.name}-today`} className="w-20">
                      Today:
                    </Label>
                    <Input
                      id={`${category.name}-today`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={metrics[category.name] || ""}
                      onChange={(e) =>
                        handleInputChange(category.name, e.target.value)
                      }
                      className="flex-grow"
                    />
                    <Button onClick={() => handleSubmit(category.name)}>
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <ToastContainer />
    </TooltipProvider>
  );
};

export default ProductionInput;
