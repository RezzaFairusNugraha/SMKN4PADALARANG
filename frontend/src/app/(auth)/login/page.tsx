"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
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
    ArrowRight,
    Loader2,
    User,
    Lock,
    LogIn
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function LoginPage() {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(username, password);
            toast.success("Login berhasil!");
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Login gagal. Silakan periksa kembali akun Anda.");
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
                    <h1 className="text-2xl font-black tracking-tight mt-4">Selamat Datang Kembali</h1>
                    <p className="text-sm text-muted-foreground font-medium text-center">
                        Masukkan akun untuk mengakses sistem akademik terpadu.
                    </p>
                </div>

                <Card className="glass-card border-none shadow-2xl relative overflow-hidden">
                    <CardContent className="pt-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Nama Pengguna</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        placeholder="Masukkan nama pengguna"
                                        className="pl-10 rounded-xl"
                                        required
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                                        Masuk
                                        <ArrowRight className="h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <div className="text-sm text-center font-medium text-muted-foreground">
                            Belum punya akun?{" "}
                            <Link href="/register" className="text-primary font-bold hover:underline">
                                Daftar di sini
                            </Link>
                        </div>
                    </CardFooter>
                </Card>

                <p className="text-center text-[10px] text-muted-foreground font-bold mt-8 uppercase tracking-widest">
                    SMK BISA, SMK HEBAT!
                </p>
            </motion.div>
        </div>
    );
}
