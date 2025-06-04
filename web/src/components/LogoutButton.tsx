"use client";

import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { logout } from "@/services/authService";

interface LogoutButtonProps {
  variant?: "contained" | "outlined" | "text";
  size?: "small" | "medium" | "large";
  className?: string;
}

const LogoutButton = ({ 
  variant = "outlined", 
  size = "medium", 
  className 
}: LogoutButtonProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to login page after logout
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API call fails, still redirect to login
      router.push("/login");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
      color="error"
    >
      Logout
    </Button>
  );
};

export default LogoutButton; 