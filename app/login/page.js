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
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [jobId, setJobId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  const handleDemoLogin = (role) => {
    // Set demo credentials based on the selected role
    if (role === "salesperson") {
      setJobId("salesperson");
      setPassword("12345");
    } else if (role === "admin") {
      setJobId("admin");
      setPassword("12345");
    } else if (role === "production") {
      setJobId("production");
      setPassword("12345");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("https://new-project-backend.vercel.app/auth/login", {
        jobId,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        localStorage.setItem("refreshToken", response.data.data.refreshToken);

        const userRole = response.data.data.user.role;
        const userDetails = {
          name: response.data.data.user.fullName,
          jobId: response.data.data.user.jobId,
          role: userRole,
          ...(userRole === "salesperson" && {
            area: response.data.data.user.area,
            totalTargetCompleted: response.data.data.user.totalTargetCompleted,
          }),
        };
        
        localStorage.setItem("userDetails", JSON.stringify(userDetails));

        if (userRole === "salesperson") router.push("/");
        else if (userRole === "admin") router.push("/admin");
        else if (userRole === "production") router.push("/production");
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
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
              <Label htmlFor="demoSelect" className="text-gray-200">
                Demo Login
              </Label>
              <select
                id="demoSelect"
                onChange={(e) => handleDemoLogin(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 rounded-md"
              >
                <option value="">Select a role</option>
                <option value="salesperson">Salesperson</option>
                <option value="admin">Admin</option>
                <option value="production">Production</option>
              </select>
            </div>
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
              disabled={loading}
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
