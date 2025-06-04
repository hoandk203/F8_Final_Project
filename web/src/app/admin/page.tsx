"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthTokens, clearAuthTokens } from "@/services/authService";

const AdminPage = () => {
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const tokens = getAuthTokens();
            
            if (!tokens?.access_token || tokens.role !== "admin") {
                clearAuthTokens();
                router.push("/vendor-login");
                return;
            }
        };

        checkAuth();
    }, [router]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <p>Welcome to the Admin Panel</p>
        </div>
    );
};

export default AdminPage;