"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    UserSquare2,
    GraduationCap,
    BookOpen,
    ArrowUpRight,
    Loader2,
    Newspaper,
    Calendar,
    ChevronRight,
    User,
    ArrowRight
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

import { motion } from "framer-motion";
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

export default function AdminDashboard() {
    const { data: stats, isLoading } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: async () => {
            const response = await apiClient.get("/api/dashboard/statistics");
            return response.data;
        }
    });

    const { data: berita, isLoading: beritaLoading } = useQuery({
        queryKey: ["latest-berita-admin"],
        queryFn: async () => {
            const response = await apiClient.get("/api/berita/");
            return response.data;
        }
    });

    if (isLoading) {
        return (
            <DashboardLayout role="Admin">
                <div className="flex h-[60vh] items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
                </div>
            </DashboardLayout>
        );
    }

    const statCards = [
        { title: "Total Siswa", value: stats?.total_siswa || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { title: "Total Guru", value: stats?.total_guru || 0, icon: UserSquare2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        { title: "Total Kelas", value: stats?.total_kelas || 0, icon: GraduationCap, color: "text-violet-500", bg: "bg-violet-500/10", border: "border-violet-500/20" },
        { title: "Mata Pelajaran", value: stats?.total_mapel || 0, icon: BookOpen, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    ];

    const pieData = Object.entries(stats?.gender_distribution || {}).map(([name, value]) => ({
        name,
        value
    }));

    const COLORS = ["#3b82f6", "#f97316"];

    return (
        <DashboardLayout role="Admin">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black tracking-tight text-foreground">Selamat Datang, Admin!</h2>
                    <p className="text-muted-foreground font-medium">Berikut adalah rangkuman data akademik hari ini.</p>
                </div>

                <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
                        <motion.div key={stat.title} variants={item}>
                            <Card className={cn("overflow-hidden border-none shadow-none glass-card group cursor-pointer h-full")}>
                                <div className={cn("absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-20 transition-all duration-500 group-hover:scale-150", stat.bg)} />
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">{stat.title}</CardTitle>
                                    <div className={cn("p-2.5 rounded-xl border-2 shadow-sm transition-all duration-300 group-hover:scale-110", stat.bg, stat.border)}>
                                        <stat.icon className={cn("h-5 w-5", stat.color)} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-4xl font-black mb-1 tabular-nums">{stat.value}</div>
                                    <p className="text-xs font-bold text-muted-foreground flex items-center">
                                        <span className="flex items-center text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded mr-2">
                                            <ArrowUpRight className="h-3 w-3 mr-1" />
                                            Live
                                        </span>
                                        Data Real-time
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                    <motion.div className="lg:col-span-4" variants={item}>
                        <Card className="border-none shadow-none glass-card overflow-hidden">
                            <CardHeader className="pb-0 pt-6 px-6">
                                <CardTitle className="text-xl font-black flex items-center gap-2">
                                    <div className="w-2 h-6 bg-primary rounded-full" />
                                    Statistik Akademik
                                </CardTitle>
                                <p className="text-sm text-muted-foreground font-medium">Perbandingan data master sistem</p>
                            </CardHeader>
                            <CardContent className="h-[350px] p-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={statCards}>
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                        <XAxis
                                            dataKey="title"
                                            fontSize={11}
                                            fontWeight={700}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        />
                                        <YAxis
                                            fontSize={11}
                                            fontWeight={700}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'hsl(var(--muted)/0.2)', radius: 8 }}
                                            contentStyle={{
                                                borderRadius: '12px',
                                                border: 'none',
                                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                        <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div className="lg:col-span-3" variants={item}>
                        <Card className="border-none shadow-none glass-card h-full overflow-hidden">
                            <CardHeader className="pb-4 pt-6 px-6">
                                <CardTitle className="text-xl font-black flex items-center gap-2">
                                    <div className="w-2 h-6 bg-blue-500 rounded-full" />
                                    Distribusi Gender
                                </CardTitle>
                                <p className="text-sm text-muted-foreground font-medium">Berdasarkan data siswa terdaftar</p>
                            </CardHeader>
                            <CardContent className="h-[300px] flex items-center justify-center relative">
                                {pieData.length > 0 ? (
                                    <>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    innerRadius={80}
                                                    outerRadius={110}
                                                    paddingAngle={8}
                                                    cornerRadius={10}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        borderRadius: '12px',
                                                        border: 'none',
                                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-3xl font-black tabular-nums">100%</span>
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Update</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground italic">
                                        <p>Data belum tersedia</p>
                                    </div>
                                )}
                            </CardContent>
                            <div className="px-6 pb-6 flex justify-center gap-6">
                                {pieData.map((d, i) => (
                                    <div key={d.name} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="text-xs font-bold uppercase tracking-wider">{d.name}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                </div>

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
                            <p className="text-sm text-muted-foreground font-medium ml-1">Pantau informasi yang baru saja dipublikasikan.</p>
                        </div>
                        <Button
                            variant="ghost"
                            className="font-black gap-2 hover:bg-primary/5 hover:text-primary transition-all rounded-xl"
                            onClick={() => window.location.href = '/admin/berita'}
                        >
                            Kelola Semua Berita
                            <ArrowUpRight className="h-4 w-4" />
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
                                                <div className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                                                        Baca Selengkapnya
                                                        <ArrowRight className="h-3 w-3" />
                                                    </span>
                                                    <span className="text-[10px] font-black p-1 px-2 rounded-lg bg-primary/10 text-primary uppercase">UID: {news.id_user}</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center gap-4 bg-muted/20 rounded-[2rem] border border-dashed border-border/50">
                                <Newspaper className="h-10 w-10 text-muted-foreground/20" />
                                <p className="text-muted-foreground font-bold italic">Belum ada berita terbaru hari ini.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
}
