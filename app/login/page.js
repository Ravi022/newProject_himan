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

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempted with:", { username, password });
    // Here you would typically call your authentication function
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
              <Label htmlFor="username" className="text-gray-200">
                Username
              </Label>
              <div className="relative">
                <UserIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={18}
                />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
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
            >
              Log in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
