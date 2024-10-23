"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTheme } from "next-themes";
import {
  FileSpreadsheet,
  Box,
  TruckIcon,
  BarChart3,
  ChevronDown,
  Download,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Header from "@/components/Header/Header";
import MTDDashboardDisplay from "@/components/MTDDashboardDisplay/MTDDashboardDisplay";

const categories = [
  { name: "glovesProduction", icon: FileSpreadsheet, color: "bg-blue-500" },
  { name: "fgStocks", icon: Box, color: "bg-green-500" },
  { name: "dispatchDetails", icon: TruckIcon, color: "bg-yellow-500" },
  { name: "productionReport", icon: BarChart3, color: "bg-purple-500" },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function AdminDashboard() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [s3Key, setS3Key] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);

    if (category !== "productionReport") {
      // Fetch latest file for the category
      const accessToken = localStorage.getItem("accessToken"); // Get accessToken from localStorage
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/admin/files",
          { fileType: category },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("CategoryClick:", response.data);
        setFileUrl(response.data.s3FileUrl); // Set file URL for the selected category
        setS3Key(response.data.s3Key); // Set s3Key for downloading
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    }
  };

  const handleDownload = () => {
    if (!fileUrl) return; // If no file URL is present

    // Create a link element to download the file
    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", s3Key.split("/").pop()); // Extract file name from s3Key
    document.body.appendChild(link);

    // Simulate a click on the link to trigger the download
    link.click();

    // Clean up by removing the link after download is initiated
    link.parentNode.removeChild(link);
  };

  const handleProductionReportSubmit = async () => {
    if (selectedMonth && selectedYear) {
      const accessToken = localStorage.getItem("accessToken");

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/admin/files",
          {
            fileType: "productionReport",
            month: selectedMonth,
            year: selectedYear,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        console.log("productionReport:", response.data);
        setFileUrl(response.data.s3FileUrl); // Set file URL for the production report
        setS3Key(response.data.s3Key); // Set s3Key for downloading
      } catch (error) {
        console.error("Error fetching production report:", error);
      }
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header saleperson={{ name: "Admin", jobId: "ADMIN001" }} />
      <div className="p-8 max-w-7xl flex flex-row justify-center items-center w-full">
        <MTDDashboardDisplay />
      </div>
      <div className="px-12">
        <div className="max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {categories.map((category) => (
              <Dialog key={category.name}>
                <DialogTrigger asChild>
                  <Card
                    className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <div
                        className={`${category.color} text-white p-3 rounded-full mb-4`}
                      >
                        <category.icon className="h-8 w-8" />
                      </div>
                      <h2 className="text-lg font-semibold capitalize">
                        {category.name}
                      </h2>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="capitalize">
                      {category.name}
                    </DialogTitle>
                  </DialogHeader>
                  {category.name === "productionReport" ? (
                    <div className="grid gap-4">
                      <Select onValueChange={setSelectedMonth}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select onValueChange={setSelectedYear}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {years.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleProductionReportSubmit}
                        className="w-full mt-4"
                      >
                        Submit
                      </Button>
                    </div>
                  ) : null}
                  <div className="h-[300px] bg-muted rounded-md p-4 overflow-auto">
                    {fileUrl ? (
                      // If the file is a PDF or an image, display it using an iframe or embed tag
                      /\.(pdf|jpg|jpeg|png)$/.test(s3Key) ? (
                        <iframe
                          src={fileUrl}
                          title="File Viewer"
                          width="100%"
                          height="300px"
                          className="rounded-md"
                        ></iframe>
                      ) : (
                        // For .xlsx or other non-displayable files, show the download link
                        <a
                          href={fileUrl}
                          download={s3Key.split("/").pop()}
                          className="text-primary"
                        >
                          Download File
                        </a>
                      )
                    ) : (
                      <p className="text-muted-foreground">
                        File content would be displayed here.
                      </p>
                    )}
                  </div>
                  <Button onClick={handleDownload} className="w-full mt-4">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
