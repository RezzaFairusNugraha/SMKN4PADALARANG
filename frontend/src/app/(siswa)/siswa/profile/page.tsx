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
import { User, Mail, Phone, MapPin, Calendar, Lock, Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";

export default function SiswaProfile() {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        nama: "",
        no_hp: "",
        alamat: "",
        tanggal_lahir: "",
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
        if (profile?.siswa) {
            setFormData({
                nama: profile.siswa.nama || "",
                no_hp: profile.siswa.no_hp || "",
                alamat: profile.siswa.alamat || "",
                tanggal_lahir: profile.siswa.tanggal_lahir || "",
                jenis_kelamin: profile.siswa.jenis_kelamin || "Laki-laki",
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
            <DashboardLayout role="Siswa">
                <div className="flex h-[400px] items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="Siswa">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black tracking-tight">Pengaturan Profil</h2>
                    <p className="text-muted-foreground font-medium">Kelola informasi pribadi dan keamanan akun Anda.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-8">
                        {/* Sidebar Information */}
                        <div className="md:col-span-1 space-y-6">
                            <Card className="border-none shadow-none glass-card overflow-hidden">
                                <CardContent className="pt-6 text-center space-y-4">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mx-auto">
                                        <User className="w-12 h-12 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-xl">{profile?.siswa?.nama || profile?.username}</h3>
                                        <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">{profile?.role}</p>
                                    </div>
                                    <div className="pt-4 border-t border-border/50 text-left space-y-3">
                                        <div className="flex items-center gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                                <span className="font-black text-[10px] text-primary">NISN</span>
                                            </div>
                                            <span className="font-bold">{profile?.siswa?.nisn}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Edit Form */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="border-none shadow-none glass-card">
                                <CardHeader>
                                    <CardTitle className="text-xl font-black flex items-center gap-2">
                                        <div className="w-2 h-6 bg-primary rounded-full" />
                                        Data Pribadi
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
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
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
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
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest ml-1">Tanggal Lahir</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="date"
                                                    className="pl-10 rounded-xl"
                                                    value={formData.tanggal_lahir}
                                                    onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest ml-1">Alamat Lengkap</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                className="pl-10 rounded-xl h-20"
                                                value={formData.alamat}
                                                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-none glass-card">
                                <CardHeader>
                                    <CardTitle className="text-xl font-black flex items-center gap-2">
                                        <div className="w-2 h-6 bg-rose-500 rounded-full" />
                                        Keamanan
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest ml-1">Ganti Password (Opsional)</Label>
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
                                        <p className="text-[10px] text-muted-foreground font-medium ml-1 italic">
                                            Kosongkan jika tidak ingin mengganti password.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Button
                                type="submit"
                                className="w-full h-14 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-primary/20"
                                disabled={mutation.isPending}
                            >
                                {mutation.isPending ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                                Simpan Perubahan
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    );
}
