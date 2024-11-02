"use client";
import { useState, useEffect } from "react";
import axios from "axios"; // Axios for API calls
import Image from "next/image";
import { User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation"; // For routing/navigation
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import companyLogo from "../../assets/companyLogo.png";


export default function Header() {
  const [theme, setTheme] = useState("light"); // Default to "light" mode
  const router = useRouter();
  const [salesperson, setSalesperson] = useState({});

  useEffect(() => {
    const salespersonDetails = localStorage.getItem("userDetails");
    if (salespersonDetails) {
      const salesManager = JSON.parse(salespersonDetails);
      setSalesperson(salesManager);
    }
  }, []);

  console.log("salesperson:", salesperson);

  // Fetch theme from localStorage on initial render
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      // Set default theme to dark
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  }, []);

  // Toggle theme between light and dark and store it in localStorage
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleChangePasswordClick = () => {
    router.push("/changePassword"); // Navigate to the changePassword page
  };

  const handleOnClickLogout = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      // Make the logout request to the backend
      const response = await axios.get(
        "https://kooviot.vercel.app/common/logoutUser",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Send token in the header
          },
        }
      );

      if (response.status === 200) {
        // Clear tokens or relevant user data from localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userDetails");

        // Navigate to the login page
        router.push("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      // Optionally, handle the error (show a notification, etc.)
    }
  };

  // Determine if the user is an admin
  const isAdmin = salesperson.role === "admin";

  return (
    <header className="bg-background text-foreground shadow-md border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Image
          src={companyLogo}
          alt="Company Logo"
          width={120}
          height={40}
          className="dark:invert"
          style={{ height: "auto" }} // Maintain aspect ratio
          priority // Add priority if it's above the fold
        />

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="mr-2"
          >
            {theme === "light" ? "🌙" : "☀️"}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={
                      salesperson.avatarUrl || "https://github.com/shadcn.png"
                    }
                    alt={salesperson.name}
                  />
                  <AvatarFallback>{salesperson.name}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {salesperson.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Job ID: {salesperson.jobId}
                  </p>
                  {/* Show area only for salespersons */}
                  {isAdmin ? null : (
                    <p className="text-xs leading-none text-muted-foreground">
                      Area: {salesperson.area}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleChangePasswordClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleOnClickLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
