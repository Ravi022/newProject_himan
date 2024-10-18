"use client";
import React, { useState } from "react";
import { Moon, Sun, Upload, Trash2 } from "lucide-react";

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

const ProductionDashboard = () => {
  const [theme, setTheme] = useState("light");
  const [xlsxFiles, setXlsxFiles] = useState([
    { name: "Gloves Production", file: null },
    { name: "FG Stocks", file: null },
    { name: "Dispatch Details", file: null },
  ]);
  const [xlsmFile, setXlsmFile] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

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

  const handleXlsxFileUpload = (index, file) => {
    const newFiles = [...xlsxFiles];
    newFiles[index].file = file;
    setXlsxFiles(newFiles);
  };

  const handleXlsxFileDelete = (index) => {
    const newFiles = [...xlsxFiles];
    newFiles[index].file = null;
    setXlsxFiles(newFiles);
  };

  return (
    <div
      className={`min-h-screen p-8 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Production Dashboard</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {xlsxFiles.map((file, index) => (
            <Card key={file.name}>
              <CardHeader>
                <CardTitle>{file.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept=".xlsx"
                    onChange={(e) =>
                      handleXlsxFileUpload(index, e.target.files[0])
                    }
                    className="flex-grow"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => console.log(`Uploading ${file.name}...`)}
                    disabled={!file.file}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  {file.file && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleXlsxFileDelete(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {file.file && <p className="mt-2 text-sm">{file.file.name}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Production Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: 10 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2 flex-grow">
                <Input
                  type="file"
                  accept=".xlsm"
                  onChange={(e) => setXlsmFile(e.target.files[0])}
                  className="flex-grow"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => console.log("Uploading XLSM file...")}
                  disabled={!xlsmFile}
                >
                  <Upload className="h-4 w-4" />
                </Button>
                {xlsmFile && (
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => setXlsmFile(null)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            {xlsmFile && <p className="mt-2 text-sm">{xlsmFile.name}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductionDashboard;
