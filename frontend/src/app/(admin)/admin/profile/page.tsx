"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useState } from "react";
import { toast } from "sonner";
import { User, Lock, Loader2, Save, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminProfile() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });

    const { data: profile, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await apiClient.get("/api/auth/profile");
            return response.data;
        }
    });

    const mutation = useMutation({
        mutationFn: async (newData: any) => {
            return await apiClient.put("/api/auth/profile", newData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success("Profil berhasil diperbarui!");
            setFormData({ password: "", confirmPassword: "" });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal memperbarui profil");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Password konfirmasi tidak cocok");
            return;
        }
        if (!formData.password) {
            toast.error("Silakan masukkan password baru");
            return;
        }
        mutation.mutate({ password: formData.password });
    };

    if (isLoading) {
        return (
            <DashboardLayout role="Admin">
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="Admin">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black tracking-tight">Akun Administrator</h2>
                    <p className="text-muted-foreground font-medium">Kelola kredensial keamanan akses panel kontrol.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Sidebar */}
                        <div className="md:col-span-1 space-y-6">
                            <Card className="border-none shadow-none glass-card overflow-hidden">
                                <CardContent className="pt-6 text-center space-y-4">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mx-auto">
                                        <ShieldCheck className="w-12 h-12 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl">{profile?.username}</h3>
                                        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">Master Administrator</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Form */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="border-none shadow-none glass-card">
                                <CardHeader>
                                    <CardTitle className="text-xl font-black flex items-center gap-2">
                                        <div className="w-2 h-6 bg-rose-500 rounded-full" />
                                        Ubah Kredensial
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest ml-1">Username (Read Only)</Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    className="pl-10 rounded-xl bg-muted/50"
                                                    value={profile?.username}
                                                    readOnly
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest ml-1">Password Baru</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10 rounded-xl"
                                                    value={formData.password}
                                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest ml-1">Konfirmasi Password</Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="pl-10 rounded-xl"
                                                    value={formData.confirmPassword}
                                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full h-14 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20 mt-4"
                                            disabled={mutation.isPending}
                                        >
                                            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                                            Update Password
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
