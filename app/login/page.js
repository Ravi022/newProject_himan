"use client";
import { useState } from "react";
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
import { LockIcon, UserIcon } from "lucide-react";
import axios from "axios"; // Import axios
import { useRouter } from "next/navigation";
import { ro } from "date-fns/locale";

export default function LoginPage() {
  const [jobId, setJobId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Optional: To handle loading state
  const [error, setError] = useState(null); // Optional: To handle errors

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    try {
      const response = await axios.post("https://kooviot.vercel.app/auth/login", {
        jobId, // Send jobId instead of username
        password,
      });
      console.log("Login successful:", response.data);

      // Handle successful login, e.g., save token, redirect, etc.
      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);
        console.log(
          localStorage.getItem("accessToken"),
          localStorage.getItem("refreshToken")
        );

        const userRole = response.data.data.user.role;
        if (userRole === "salesperson") {
          const userDetails = {
            name: response.data.data.user.fullName,
            area: response.data.data.user.area,
            jobId: response.data.data.user.jobId,
            totalTargetCompleted: response.data.data.user.totalTargetCompleted,
            role: userRole,
          };

          // Convert the object to a JSON string and store it in localStorage
          localStorage.setItem("userDetails", JSON.stringify(userDetails));
          console.log(userDetails);
          router.push("/");
        } else if (userRole === "admin") {
          console.log("admin login:", response.data);
          const adminDetails = {
            name: response.data.data.user.fullName,
            jobId: response.data.data.user.jobId,
            role: userRole,
          };
          localStorage.setItem("userDetails", JSON.stringify(adminDetails));
          router.push("/admin");
        } else if (userRole === "production") {
          console.log("production login:", response.data);
          const productionDetails = {
            name: response.data.data.user.fullName,
            jobId: response.data.data.user.jobId,
            role: userRole,
          };
          localStorage.setItem(
            "userDetails",
            JSON.stringify(productionDetails)
          );
          router.push("/production");
        } else {
          router.push("/login");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-gray-100">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">
              Login
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobId" className="text-gray-200">
                Job Id
              </Label>
              <div className="relative">
                <UserIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <Input
                  id="jobId"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  placeholder="Enter your job id"
                  required
                  className="pl-10 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">
                Password
              </Label>
              <div className="relative">
                <LockIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="pl-10 bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Logging in..." : "Log in"}
            </Button>
          </CardFooter>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </Card>
    </div>
  );
}
