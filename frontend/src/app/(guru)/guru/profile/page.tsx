"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Mail, Phone, Lock, Loader2, Save, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function GuruProfile() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        no_hp: "",
        jenis_kelamin: "",
        password: ""
    });

    const { data: profile, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: async () => {
            const response = await apiClient.get("/api/auth/profile");
            return response.data;
        }
    });

    useEffect(() => {
        if (profile?.guru) {
            setFormData({
                nama: profile.guru.nama || "",
                email: profile.guru.email || "",
                no_hp: profile.guru.no_hp || "",
                jenis_kelamin: profile.guru.jenis_kelamin || "Laki-laki",
                password: ""
            });
        }
    }, [profile]);

    const mutation = useMutation({
        mutationFn: async (newData: any) => {
            return await apiClient.put("/api/auth/profile", newData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
            toast.success("Profil berhasil diperbarui!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal memperbarui profil");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updateData: any = { ...formData };
        if (!updateData.password) delete updateData.password;
        mutation.mutate(updateData);
    };

    if (isLoading) {
        return (
            <DashboardLayout role="Guru">
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="Guru">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">Profil Guru</h2>
                    <p className="text-sm md:text-base text-muted-foreground font-medium">Kelola data profesional dan informasi kontak Anda.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="border-none shadow-none glass-card overflow-hidden">
                                <CardContent className="pt-6 text-center space-y-4">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mx-auto">
                                        <BadgeCheck className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg md:text-xl">{profile?.guru?.nama || profile?.username}</h3>
                                        <p className="text-[10px] md:text-sm text-muted-foreground font-bold uppercase tracking-widest">{profile?.role}</p>
                                    </div>
                                    <div className="pt-4 border-t border-border/50 text-left space-y-3">
                                        <div className="flex items-center gap-3 text-xs md:text-sm">
                                            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                                <span className="font-black text-[9px] md:text-[10px] text-primary">NIP</span>
                                            </div>
                                            <span className="font-bold truncate">{profile?.guru?.nip}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Main Form */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-none shadow-none glass-card">
                                <CardHeader>
                                    <CardTitle className="text-xl font-black flex items-center gap-2">
                                        <div className="w-2 h-6 bg-primary rounded-full" />
                                        Informasi Umum
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest ml-1">Nama Lengkap</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                className="pl-10 rounded-xl"
                                                value={formData.nama}
                                                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest ml-1">Email</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="email"
                                                    className="pl-10 rounded-xl"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest ml-1">No. HP</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    className="pl-10 rounded-xl"
                                                    value={formData.no_hp}
                                                    onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest ml-1">Jenis Kelamin</Label>
                                        <Select
                                            value={formData.jenis_kelamin}
                                            onValueChange={(v) => setFormData({ ...formData, jenis_kelamin: v })}
                                        >
                                            <SelectTrigger className="rounded-xl">
                                                <SelectValue placeholder="Pilih Jenis Kelamin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                                                <SelectItem value="Perempuan">Perempuan</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-none glass-card">
                                <CardHeader>
                                    <CardTitle className="text-xl font-black flex items-center gap-2">
                                        <div className="w-2 h-6 bg-rose-500 rounded-full" />
                                        Keamanan Akun
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest ml-1">Ganti Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="pl-10 rounded-xl"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Button
                                type="submit"
                                className="w-full h-12 md:h-14 rounded-2xl font-black text-base md:text-lg gap-2 shadow-xl shadow-primary/20"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="w-5 h-5" />}
                                Simpan Perubahan Profil
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
