"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
    Newspaper,
    Search,
    Calendar,
    User,
    ArrowRight,
    Loader2,
    ChevronLeft,
    Clock
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PublicBeritaPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const { data: berita, isLoading } = useQuery({
        queryKey: ["public-berita-all"],
        queryFn: async () => {
            const response = await apiClient.get("/api/berita/public/all");
            return response.data;
        }
    });

    const filteredBerita = berita?.filter((item: any) =>
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.isi.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <div className="relative h-[40vh] min-h-[400px] overflow-hidden bg-slate-950 flex items-center justify-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_var(--background)_100%)] opacity-70" />
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                </div>

                <div className="relative z-10 max-w-5xl px-6 text-center space-y-6">

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter text-foreground"
                    >
                        Berita<span className="text-primary">Sekolah</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-medium"
                    >
                        Temukan informasi terbaru, prestasi siswa, dan pengumuman penting seputar lingkungan sekolah kami.
                    </motion.p>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 pb-24">
                <div className="flex flex-col gap-12">
                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-2xl mx-auto w-full"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-foreground rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-500" />
                            <div className="relative flex items-center bg-card border border-border/50 rounded-2xl p-2 shadow-2xl">
                                <Search className="ml-4 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Cari kabar atau informasi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="border-0 focus-visible:ring-0 text-lg bg-transparent h-12"
                                />
                                <Button className="rounded-xl px-8 font-black">Cari</Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Results Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoading ? (
                            Array(6).fill(0).map((_, i) => (
                                <div key={i} className="h-[450px] rounded-[2.5rem] bg-card/50 border border-border/50 animate-pulse" />
                            ))
                        ) : filteredBerita?.length > 0 ? (
                            filteredBerita.map((item: any, idx: number) => (
                                <motion.div
                                    key={item.id_berita}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * (idx % 3) }}
                                >
                                    <Link href={`/berita/${item.id_berita}`}>
                                        <Card className="group h-[480px] flex flex-col overflow-hidden bg-card/40 backdrop-blur-xl border-border/40 hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] shadow-xl hover:shadow-primary/5">
                                            <div className="h-56 relative overflow-hidden shrink-0">
                                                {item.gambar ? (
                                                    <img
                                                        src={`http://localhost:8000/api/uploads/${item.gambar}`}
                                                        alt={item.judul}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                                                        <Newspaper className="h-20 w-20 text-primary/20 group-hover:scale-110 transition-transform duration-700" />
                                                    </div>
                                                )}
                                                <div className="absolute top-6 left-6 flex gap-2">
                                                    <span className="px-3 py-1 rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-[10px] font-black uppercase tracking-widest text-foreground">
                                                        Informasi
                                                    </span>
                                                </div>
                                            </div>

                                            <CardContent className="p-8 flex-1 flex flex-col justify-between">
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                                        <div className="flex items-center gap-2 text-muted-foreground">
                                                            <Calendar className="h-3 w-3 text-primary" />
                                                            {format(new Date(item.tanggal_post), "dd MMM yyyy", { locale: id })}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-primary">
                                                            <User className="h-3 w-3" />
                                                            {item.nama_penulis}
                                                        </div>
                                                    </div>
                                                    <h3 className="text-2xl font-black leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                        {item.judul}
                                                    </h3>
                                                    <p className="text-muted-foreground font-medium text-sm line-clamp-3 leading-relaxed">
                                                        {item.isi}
                                                    </p>
                                                </div>

                                                <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                                                    <span className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                                        Baca Selengkapnya
                                                        <ArrowRight className="h-4 w-4" />
                                                    </span>
                                                    <div className="flex items-center gap-1.5 text-muted-foreground/40 text-[10px] font-black">
                                                        <Clock className="h-3 w-3" />
                                                        3 MIN READ
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-24 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="p-6 rounded-full bg-muted/20 border border-dashed border-border mb-4">
                                    <Search className="h-10 w-10 text-muted-foreground/30" />
                                </div>
                                <h3 className="text-2xl font-black text-foreground/50">Tidak Ditemukan</h3>
                                <p className="text-muted-foreground max-w-sm mx-auto font-medium">
                                    Maaf, kabar yang kamu cari tidak tersedia. Coba kata kunci lain atau periksa kembali nanti.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer Sidebar / Navigation Suggestion */}
            <div className="border-t border-border/40 bg-card/20 backdrop-blur-sm py-20 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h4 className="text-2xl font-black tracking-tight">Punya berita untuk dibagikan?</h4>
                        <p className="text-muted-foreground font-medium">Kontribusi sekarang melalui portal guru atau siswa.</p>
                    </div>
                    <Link href="/login">
                        <Button variant="outline" size="lg" className="rounded-2xl font-black px-10 h-16 hover:bg-primary hover:text-white transition-all">
                            Masuk ke Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
