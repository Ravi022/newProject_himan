"use client";
import React, { useState } from "react";
import axios from "axios";
import { Upload, Trash2 } from "lucide-react";
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
import Loading from "./loading";
import ProductionInput from "@/components/ProductionInput/ProductionInput";

const ProductionDashboard = () => {
  const [xlsxFiles, setXlsxFiles] = useState([
    { name: "Gloves Production", file: null },
    { name: "FG Stocks", file: null },
    { name: "Dispatch Details", file: null },
  ]);
  const [xlsmFile, setXlsmFile] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(false);

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

  // Handle file selection (not upload)
  const handleFileSelection = (index, file) => {
    const newFiles = [...xlsxFiles];
    newFiles[index].file = file;
    setXlsxFiles(newFiles);
  };

  // Handle file upload on button click
  const handleXlsxFileUpload = async (index) => {
    setLoading(true);
    const file = xlsxFiles[index].file;
    if (file) {
      try {
        const formData = new FormData();
        formData.append("fileType", xlsxFiles[index].name);
        formData.append("file", file);

        await axios.post("http://127.0.0.1:8000/production/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        alert(`${xlsxFiles[index].name} file uploaded successfully!`);
      } catch (error) {
        console.error("Error details:", error);
        alert(`Error uploading ${xlsxFiles[index].name}: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please select a file to upload.");
    }
  };

  const handleXlsxFileDelete = (index) => {
    const newFiles = [...xlsxFiles];
    newFiles[index].file = null;
    setXlsxFiles(newFiles);
  };

  const handleXlsmFileUpload = async () => {
    if (xlsmFile) {
      try {
        const formData = new FormData();
        formData.append("fileType", "Production Report");
        formData.append("file", xlsmFile);
        formData.append("reportMonth", selectedMonth);
        formData.append("reportYear", selectedYear);

        await axios.post("http://127.0.0.1:8000/production/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("Production report uploaded successfully!");
      } catch (error) {
        console.error("Error uploading the production report:", error);
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <div>
      <Header saleperson={{ jobId: "productionPerson", name: "production" }} />
      <div className=" p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Production Dashboard</h1>

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
                        handleFileSelection(index, e.target.files[0])
                      }
                      className="flex-grow"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleXlsxFileUpload(index)}
                      disabled={!file.file} // Only enable button if a file is selected
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
                  {file.file && (
                    <p className="mt-2 text-sm">{file.file.name}</p>
                  )}
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
                    onClick={handleXlsmFileUpload}
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
      <div>
        <ProductionInput />
      </div>
    </div>
  );
};

export default ProductionDashboard;
