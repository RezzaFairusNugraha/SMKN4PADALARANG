"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

interface User {
    id_user: number;
    username: string;
    role: "Admin" | "Guru" | "Siswa";
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setLoading(false);
                    return;
                }
                const response = await apiClient.get("/api/auth/me");
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (username: string, password: string) => {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        const response = await apiClient.post("/api/auth/login", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        const { access_token, refresh_token } = response.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        const userResponse = await apiClient.get("/api/auth/me");
        setUser(userResponse.data);

        // Redirect based on role
        const role = userResponse.data.role;
        if (role === "Admin") router.push("/admin");
        else if (role === "Guru") router.push("/guru");
        else if (role === "Siswa") router.push("/siswa");
    };

    const register = async (data: any) => {
        await apiClient.post("/api/auth/register", data);
        // Automatically login after registration
        await login(data.username, data.password);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        router.push("/login");
    };

    return { user, loading, login, register, logout };
}
