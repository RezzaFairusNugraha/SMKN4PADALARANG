"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { apiClient } from "@/lib/api-client";
import PublicNavbar from "@/components/public/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    GraduationCap,
    ArrowRight,
    Loader2,
    User,
    Mail,
    Lock,
    Users,
    UserCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState<"Siswa" | "Guru">("Siswa");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        nisn: "",
        nip: "",
        nama: "",
        jenis_kelamin: "",
        no_hp: "",
        id_mapel: "",
        id_kelas: "",
        id_kelas_guru: ""
    });

    // Fetch Master Data for dropdowns
    // Must be fetched conditionally or always? Always is fine since endpoints are public.
    const [mapels, setMapels] = useState<any[]>([]);
    const [kelas, setKelas] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Mapel
                const mapelRes = await apiClient.get("/api/mapel/");
                setMapels(mapelRes.data);

                // Fetch Kelas
                const kelasRes = await apiClient.get("/api/kelas/");
                setKelas(kelasRes.data);
            } catch (err) {
                console.error("Failed to fetch master data", err);
                toast.error("Gagal memuat data master");
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Password tidak cocok");
            return;
        }

        setIsLoading(true);
        try {
            await register({
                username: formData.username,
                password: formData.password,
                role: role,
                nisn: role === "Siswa" ? formData.nisn : undefined,
                nip: role === "Guru" ? formData.nip : undefined,
                nama: formData.nama,
                jenis_kelamin: formData.jenis_kelamin,
                no_hp: formData.no_hp,
                id_mapel: role === "Guru" && formData.id_mapel ? parseInt(formData.id_mapel) : undefined,
                id_kelas_guru: role === "Guru" && formData.id_kelas_guru ? parseInt(formData.id_kelas_guru) : undefined,
                id_kelas_registered: role === "Siswa" && formData.id_kelas ? parseInt(formData.id_kelas) : undefined
            });
            toast.success("Akun berhasil dibuat!");
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Gagal membuat akun");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 pt-24 lg:pt-32 relative overflow-hidden">
            <PublicNavbar />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center gap-4 mb-8">
                    <Link href="/" className="flex flex-col items-center gap-2 group">
                        <Image src="/logo.png" alt="Logo SMKN 4" width={100} height={100} className="object-contain" />
                        <span className="text-3xl font-black tracking-tighter">SMKN 4 PADALARANG</span>
                    </Link>
                    <h1 className="text-2xl font-black tracking-tight mt-4">Buat Akun Siswa/Guru</h1>
                    <p className="text-sm text-muted-foreground font-medium text-center">
                        Daftar untuk mengakses sistem akademik terpadu.
                    </p>
                </div>

                <Card className="glass-card border-none shadow-2xl relative overflow-hidden">
                    <CardHeader>
                        <div className="flex p-1 bg-muted rounded-xl mb-6">
                            <button
                                onClick={() => setRole("Siswa")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all",
                                    role === "Siswa" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Users className="h-4 w-4" />
                                Siswa
                            </button>
                            <button
                                onClick={() => setRole("Guru")}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 text-sm font-bold rounded-lg transition-all",
                                    role === "Guru" ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <UserCircle2 className="h-4 w-4" />
                                Guru
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {role === "Siswa" ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nisn">NISN</Label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="nisn"
                                                placeholder="Masukkan 10 digit NISN"
                                                className="pl-10 rounded-xl"
                                                required
                                                value={formData.nisn}
                                                onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="kelas">Kelas</Label>
                                        <select
                                            id="kelas"
                                            className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.id_kelas}
                                            required
                                            onChange={(e) => setFormData({ ...formData, id_kelas: e.target.value })}
                                        >
                                            <option value="">Pilih Kelas</option>
                                            {kelas.map((k) => (
                                                <option key={k.id_kelas} value={k.id_kelas}>
                                                    {k.kelas} {k.jurusan}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="nip">NIP</Label>
                                        <div className="relative">
                                            <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="nip"
                                                placeholder="Masukkan NIP Guru"
                                                className="pl-10 rounded-xl"
                                                required
                                                value={formData.nip}
                                                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="mapel">Mata Pelajaran Diampu</Label>
                                        <select
                                            id="mapel"
                                            className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.id_mapel}
                                            required
                                            onChange={(e) => setFormData({ ...formData, id_mapel: e.target.value })}
                                        >
                                            <option value="">Pilih Mata Pelajaran</option>
                                            {mapels.map((m) => (
                                                <option key={m.id_mapel} value={m.id_mapel}>
                                                    {m.nama_mapel} ({m.kategori})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="kelas_guru">Kelas Pengampu</Label>
                                        <select
                                            id="kelas_guru"
                                            className="w-full h-10 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.id_kelas_guru}
                                            required
                                            onChange={(e) => setFormData({ ...formData, id_kelas_guru: e.target.value })}
                                        >
                                            <option value="">Pilih Kelas</option>
                                            {kelas.map((k: any) => (
                                                <option key={k.id_kelas} value={k.id_kelas}>
                                                    {k.kelas} {k.jurusan}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="nama">Nama Lengkap</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="nama"
                                        placeholder="Masukkan nama lengkap"
                                        className="pl-10 rounded-xl"
                                        required
                                        value={formData.nama}
                                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Jenis Kelamin</Label>
                                <div className="flex gap-4">
                                    {["Laki-laki", "Perempuan"].map((g) => (
                                        <label key={g} className="flex items-center gap-2 text-sm font-medium cursor-pointer border rounded-xl p-3 flex-1 hover:bg-muted/50 transition-colors">
                                            <input
                                                type="radio"
                                                name="jenis_kelamin"
                                                value={g}
                                                checked={formData.jenis_kelamin === g}
                                                onChange={(e) => setFormData({ ...formData, jenis_kelamin: e.target.value })}
                                                className="w-4 h-4 text-primary"
                                                required
                                            />
                                            {g}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="no_hp">No HP (Opsional)</Label>
                                <Input
                                    id="no_hp"
                                    placeholder="08..."
                                    className="rounded-xl"
                                    value={formData.no_hp}
                                    onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="username">Nama Pengguna</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        placeholder="Masukkan nama pengguna"
                                        className="pl-10 rounded-xl"
                                        required
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Kata Sandi</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 rounded-xl"
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-10 rounded-xl"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full rounded-xl h-12 font-black shadow-lg shadow-primary/20 mt-2 gap-2"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Daftar Sekarang
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <div className="text-sm text-center font-medium text-muted-foreground">
                            Sudah punya akun?{" "}
                            <Link href="/login" className="text-primary font-bold hover:underline">
                                Login di sini
                            </Link>
                        </div>
                    </CardFooter>
                </Card>

                <p className="text-center text-[10px] text-muted-foreground font-bold mt-8 uppercase tracking-widest">
                    Pendidikan Berkualitas untuk Semua
                </p>
            </motion.div>
        </div>
    );
}
