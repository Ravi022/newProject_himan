"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

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

// Mock user data (can be removed once integrated with backend)
const user = {
  name: "John Doe",
  jobId: "EMP001",
  avatarUrl: "https://github.com/shadcn.png",
};

export default function Header({ saleperson }) {
  const [theme, setTheme] = useState("light"); // Initialize with "light" theme
  const router = useRouter(); // Initialize the useRouter hook

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark"); // Ensure class is only added for dark mode
  };

  const handleChangePasswordClick = () => {
    router.push("/changePassword"); // Navigate to the changePassword page
  };

  // Determine if the user is an admin
  const isAdmin = saleperson.role === "admin";

  return (
    <header className="bg-background text-foreground shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Image
          src={companyLogo}
          alt="Company Logo"
          width={120}
          height={40}
          className="dark:invert"
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
                      saleperson.avatarUrl || "https://github.com/shadcn.png"
                    }
                    alt={saleperson.name}
                  />
                  <AvatarFallback>
                    {saleperson.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {saleperson.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Job ID: {saleperson.jobId}
                  </p>
                  {/* Show area only for salespersons */}
                  {isAdmin ? null : (
                    <p className="text-xs leading-none text-muted-foreground">
                      Area: {saleperson.area}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleChangePasswordClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
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
