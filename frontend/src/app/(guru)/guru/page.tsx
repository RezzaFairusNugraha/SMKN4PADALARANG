"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, BookOpen, Users, Calendar, ClipboardCheck, Newspaper, ArrowRight, TrendingUp, ChevronRight, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export default function GuruDashboard() {
    const router = useRouter();

    const { data: stats } = useQuery({
        queryKey: ["guru-stats"],
        queryFn: async () => {
            const response = await apiClient.get("/api/dashboard/statistics/guru");
            return response.data;
        }
    });

    const { data: jadwal } = useQuery({
        queryKey: ["jadwal-guru"],
        queryFn: async () => {
            const response = await apiClient.get("/api/dashboard/jadwal");
            return response.data;
        }
    });

    const { data: berita, isLoading: beritaLoading } = useQuery({
        queryKey: ["latest-berita-guru"],
        queryFn: async () => {
            const response = await apiClient.get("/api/berita/");
            return response.data;
        }
    });

    const quickActions = [
        {
            title: "Input Nilai",
            description: "Kelola nilai UTS dan UAS siswa",
            icon: TrendingUp,
            color: "emerald",
            path: "/guru/nilai",
            gradient: "from-emerald-500/10 to-emerald-500/5"
        },
        {
            title: "Isi Absensi",
            description: "Catat kehadiran siswa harian",
            icon: ClipboardCheck,
            color: "blue",
            path: "/guru/absensi",
            gradient: "from-blue-500/10 to-blue-500/5"
        },
        {
            title: "Kelola Berita",
            description: "Publikasikan pengumuman sekolah",
            icon: Newspaper,
            color: "violet",
            path: "/guru/berita",
            gradient: "from-violet-500/10 to-violet-500/5"
        }
    ];

    return (
        <DashboardLayout role="Guru">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black tracking-tight">Selamat Datang, Guru</h2>
                    <p className="text-muted-foreground font-medium">Berikut adalah ringkasan kegiatan mengajar Anda hari ini.</p>
                </div>

                <motion.div className="grid gap-6 md:grid-cols-3">
                    <motion.div variants={item}>
                        <Card className="border-none shadow-none glass-card h-full overflow-hidden group hover:bg-primary/5 transition-all duration-500">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">Jadwal Sesi</CardTitle>
                                <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 shadow-sm group-hover:scale-110 transition-transform">
                                    <Calendar className="h-5 w-5 text-primary" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black mb-1 tabular-nums">{stats?.total_sessions || 0} Sesi</div>
                                <div className="text-xs font-bold text-muted-foreground italic flex items-center gap-1">
                                    <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                    Terdaftar di sistem
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="border-none shadow-none glass-card h-full overflow-hidden group hover:bg-primary/5 transition-all duration-500">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">Total Siswa</CardTitle>
                                <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 shadow-sm group-hover:scale-110 transition-transform">
                                    <Users className="h-5 w-5 text-violet-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black mb-1 tabular-nums">{stats?.total_students || 0}</div>
                                <div className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                    Tersebar di {stats?.assigned_classes || 0} kelas berbeda
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="border-none shadow-none glass-card h-full overflow-hidden group hover:bg-primary/5 transition-all duration-500">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">Mata Pelajaran</CardTitle>
                                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-sm group-hover:scale-110 transition-transform">
                                    <BookOpen className="h-5 w-5 text-amber-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black mb-1">{stats?.total_mapel || 0}</div>
                                <p className="text-xs font-bold text-muted-foreground">Kategori: Produktif & Umum</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Quick Actions Section */}
                <motion.div variants={item}>
                    <div className="mb-4">
                        <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                            <div className="w-1.5 h-5 bg-primary rounded-full" />
                            Aksi Cepat
                        </h3>
                        <p className="text-sm text-muted-foreground font-medium mt-1">Akses fitur utama dengan satu klik</p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {quickActions.map((action, idx) => {
                            const Icon = action.icon;
                            return (
                                <motion.div
                                    key={action.path}
                                    variants={item}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Card
                                        className={cn(
                                            "glass-card border-none cursor-pointer overflow-hidden group h-full",
                                            "hover:shadow-xl transition-all duration-300"
                                        )}
                                        onClick={() => router.push(action.path)}
                                    >
                                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity", action.gradient)} />
                                        <CardHeader className="relative pb-3">
                                            <div className="flex items-start justify-between">
                                                <div className={cn(
                                                    "p-3 rounded-xl border-2 shadow-sm group-hover:scale-110 transition-transform",
                                                    action.color === "emerald" && "bg-emerald-500/10 border-emerald-500/20",
                                                    action.color === "blue" && "bg-blue-500/10 border-blue-500/20",
                                                    action.color === "violet" && "bg-violet-500/10 border-violet-500/20"
                                                )}>
                                                    <Icon className={cn(
                                                        "h-6 w-6",
                                                        action.color === "emerald" && "text-emerald-500",
                                                        action.color === "blue" && "text-blue-500",
                                                        action.color === "violet" && "text-violet-500"
                                                    )} />
                                                </div>
                                                <ArrowRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </CardHeader>
                                        <CardContent className="relative">
                                            <h4 className="font-black text-lg mb-1">{action.title}</h4>
                                            <p className="text-sm text-muted-foreground font-medium">{action.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>

                <motion.div variants={item}>
                    <Card className="border-none shadow-none glass-card overflow-hidden">
                        <CardHeader className="px-6 pt-6 pb-4">
                            <CardTitle className="text-xl font-black flex items-center gap-2">
                                <div className="w-2 h-6 bg-primary rounded-full" />
                                Jadwal Mengajar
                            </CardTitle>
                            <p className="text-sm text-muted-foreground font-medium">Jangan lewatkan sesi mengajar Anda</p>
                        </CardHeader>
                        <CardContent className="px-6 pb-6">
                            <div className="grid gap-4">
                                {jadwal?.length > 0 ? (
                                    jadwal.map((item: any, i: number) => (
                                        <div key={i} className="group flex items-center gap-6 p-4 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300">
                                            <div className="p-3 rounded-xl bg-primary/10 border border-primary/10 group-hover:scale-110 transition-transform">
                                                <Clock className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-black text-lg">Kelas {item.id_kelas}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-muted text-muted-foreground uppercase tracking-wider">Mapel ID: {item.id_mapel}</span>
                                                    <span className="text-xs font-bold text-primary italic">08:00 - 09:30</span>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => router.push('/guru/absensi')}
                                            >
                                                Absensi
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-border/50">
                                        <Calendar className="h-12 w-12 text-muted-foreground/30 mb-4" />
                                        <p className="text-muted-foreground font-bold">Tidak ada jadwal mengajar yang ditemukan.</p>
                                        <p className="text-xs text-muted-foreground/60 mt-1">Semua sesi telah selesai atau belum dimulai.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Latest News Section */}
                <motion.div variants={item}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                    <Newspaper className="h-6 w-6" />
                                </div>
                                Berita & Pengumuman Terbaru
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium ml-1">Informasi terkini dari sekolah untuk Anda.</p>
                        </div>
                        <Button
                            variant="ghost"
                            className="font-black gap-2 hover:bg-primary/5 hover:text-primary transition-all rounded-xl"
                            onClick={() => router.push('/guru/berita')}
                        >
                            Kelola Berita
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {beritaLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="h-48 rounded-[2rem] bg-muted animate-pulse border border-border/50" />
                            ))
                        ) : berita?.length > 0 ? (
                            berita.slice(0, 3).map((news: any, idx: number) => (
                                <motion.div
                                    key={news.id_berita}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link href={`/berita/${news.id_berita}`}>
                                        <Card className="flex flex-col h-full group hover:border-primary/50 transition-all duration-300 bg-card/40 backdrop-blur-sm rounded-3xl overflow-hidden border-border/50 shadow-sm hover:shadow-xl">
                                            {news.gambar ? (
                                                <div className="h-32 w-full overflow-hidden shrink-0">
                                                    <img
                                                        src={`http://localhost:8000/api/uploads/${news.gambar}`}
                                                        alt={news.judul}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-32 bg-primary/5 flex items-center justify-center">
                                                    <Newspaper className="h-10 w-10 text-primary/20" />
                                                </div>
                                            )}
                                            <CardContent className="p-6 flex flex-col justify-between flex-1">
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase">
                                                            <Calendar className="h-3 w-3 text-primary" />
                                                            {format(new Date(news.tanggal_post), "dd MMM yyyy", { locale: id })}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase">
                                                            <User className="h-3 w-3" />
                                                            {news.nama_penulis}
                                                        </div>
                                                    </div>
                                                    <h4 className="font-black text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                                        {news.judul}
                                                    </h4>
                                                </div>
                                                <div className="pt-4 mt-4 border-t border-border/50">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                                        Baca Selengkapnya
                                                        <ArrowRight className="h-3 w-3" />
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4 bg-muted/20 rounded-[2rem] border border-dashed border-border/50">
                                <Newspaper className="h-10 w-10 text-muted-foreground/20" />
                                <p className="text-muted-foreground font-bold italic">Belum ada berita terbaru.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
}
