"use client";

import Link from "next/link";
import DashboardLayout from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Award, FileText, Newspaper, Calendar, ChevronRight, User, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

export default function SiswaDashboard() {
    const { data: stats } = useQuery({
        queryKey: ["siswa-stats"],
        queryFn: async () => {
            const response = await apiClient.get("/api/dashboard/statistics/siswa");
            return response.data;
        }
    });

    const { data: realNilai } = useQuery({
        queryKey: ["siswa-nilai-me"],
        queryFn: async () => {
            const response = await apiClient.get("/api/nilai/siswa/me");
            return response.data;
        }
    });

    const { data: rekapAbsensi } = useQuery({
        queryKey: ["rekap-absensi"],
        queryFn: async () => {
            const response = await apiClient.get("/api/dashboard/rekap-absensi");
            return response.data;
        }
    });

    const { data: berita, isLoading: beritaLoading } = useQuery({
        queryKey: ["latest-berita-siswa"],
        queryFn: async () => {
            const response = await apiClient.get("/api/berita/");
            return response.data;
        }
    });

    // Calculate attendance percentage
    const totalAttendance = rekapAbsensi ? (Object.values(rekapAbsensi) as number[]).reduce((a: number, b: number) => a + b, 0) : 0;
    const presentCount = (rekapAbsensi as any)?.["Hadir"] || 0;
    const attendancePercentage = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

    const chartData = realNilai?.map((n: any) => ({
        mapel: n.mapel?.nama_mapel?.substring(0, 5) || "??",
        nilai: n.nilai_akhir
    })) || [];

    // Calculate real average from database
    const totalNilai = realNilai?.reduce((acc: number, curr: any) => acc + curr.nilai_akhir, 0) || 0;
    const averageGrade = realNilai?.length > 0 ? (totalNilai / realNilai.length).toFixed(1) : "0";

    return (
        <DashboardLayout role="Siswa">
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black tracking-tight">Halo, Siswa</h2>
                    <p className="text-muted-foreground font-medium">Lihat progres akademik dan kehadiranmu di sini.</p>
                </div>

                <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <motion.div variants={item}>
                        <Card className="border-none shadow-none glass-card h-full overflow-hidden group hover:bg-amber-500/5 transition-all duration-500">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">Rerata Nilai</CardTitle>
                                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-sm group-hover:scale-110 transition-transform">
                                    <Award className="h-5 w-5 text-amber-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black mb-1 tabular-nums">{averageGrade}</div>
                                <p className="text-xs font-bold text-muted-foreground">Berdasarkan {realNilai?.length || 0} Mata Pelajaran</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="border-none shadow-none glass-card h-full overflow-hidden group hover:bg-emerald-500/5 transition-all duration-500">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">Kehadiran</CardTitle>
                                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm group-hover:scale-110 transition-transform">
                                    <Clock className="h-5 w-5 text-emerald-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black mb-1 tabular-nums">{Math.round(attendancePercentage)}%</div>
                                <p className="text-xs font-bold text-muted-foreground">Kualitas Kehadiran: Sempurna</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="border-none shadow-none glass-card h-full overflow-hidden group hover:bg-blue-500/5 transition-all duration-500">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">Mata Pelajaran</CardTitle>
                                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-sm group-hover:scale-110 transition-transform">
                                    <BookOpen className="h-5 w-5 text-blue-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black mb-1 tabular-nums">{realNilai?.length || 0}</div>
                                <p className="text-xs font-bold text-muted-foreground">Mata pelajaran aktif</p>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div variants={item}>
                        <Card className="border-none shadow-none glass-card h-full overflow-hidden group hover:bg-violet-500/5 transition-all duration-500">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">Status Izin</CardTitle>
                                <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 shadow-sm group-hover:scale-110 transition-transform">
                                    <FileText className="h-5 w-5 text-violet-500" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-black mb-1 tabular-nums">{rekapAbsensi?.["Izin"] || 0}</div>
                                <p className="text-xs font-bold text-muted-foreground">Jumlah Sakit/Izin</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
                    <motion.div className="lg:col-span-4" variants={item}>
                        <Card className="border-none shadow-none glass-card overflow-hidden h-full">
                            <CardHeader className="pb-0 pt-6 px-6">
                                <CardTitle className="text-xl font-black flex items-center gap-2">
                                    <div className="w-2 h-6 bg-primary rounded-full" />
                                    Perkembangan Nilai
                                </CardTitle>
                                <p className="text-sm text-muted-foreground font-medium">Grafik nilai per mata pelajaran</p>
                            </CardHeader>
                            <CardContent className="h-[350px] p-6">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <defs>
                                                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                                                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                            <XAxis
                                                dataKey="mapel"
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
                                                domain={[0, 100]}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: '12px',
                                                    border: 'none',
                                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="nilai"
                                                stroke="hsl(var(--primary))"
                                                strokeWidth={4}
                                                dot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: '#fff' }}
                                                activeDot={{ r: 8, strokeWidth: 2 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground italic gap-4">
                                        <BookOpen className="h-12 w-12 opacity-20" />
                                        <p>Data nilai belum tersedia untuk ditampilkan.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div className="lg:col-span-2" variants={item}>
                        <Card className="border-none shadow-none glass-card h-full overflow-hidden">
                            <CardHeader className="pb-4 pt-6 px-6">
                                <CardTitle className="text-xl font-black flex items-center gap-2">
                                    <div className="w-2 h-6 bg-emerald-500 rounded-full" />
                                    Ringkasan Absensi
                                </CardTitle>
                                <p className="text-sm text-muted-foreground font-medium">Status kehadiran semester ini</p>
                            </CardHeader>
                            <CardContent className="px-6 pb-6">
                                <div className="space-y-3">
                                    {Object.entries(rekapAbsensi || { "Hadir": 0, "Sakit": 0, "Izin": 0, "Alpa": 0 }).map(([status, count]) => (
                                        <div key={status} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 hover:border-primary/20 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "w-2 h-2 rounded-full",
                                                    status === "Hadir" ? "bg-emerald-500" :
                                                        status === "Sakit" ? "bg-amber-500" :
                                                            status === "Izin" ? "bg-blue-500" :
                                                                "bg-rose-500"
                                                )} />
                                                <span className="text-sm font-bold">{status}</span>
                                            </div>
                                            <span className={cn(
                                                "px-2.5 py-0.5 rounded-lg text-xs font-black",
                                                status === "Hadir" ? "bg-emerald-500/10 text-emerald-600" :
                                                    status === "Sakit" ? "bg-amber-500/10 text-amber-600" :
                                                        status === "Izin" ? "bg-blue-500/10 text-blue-600" :
                                                            "bg-rose-500/10 text-rose-600"
                                            )}>
                                                {count as number}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/10">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-primary mb-1 text-center">Persentase Kehadiran</p>
                                    <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full transition-all duration-1000"
                                            style={{ width: `${attendancePercentage}%` }}
                                        />
                                    </div>
                                    <p className="text-center text-[10px] font-bold text-primary mt-1">{Math.round(attendancePercentage)}% Terpenuhi</p>
                                </div>
                            </CardContent>
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
                                Kabar Sekolah Terbaru
                            </h3>
                            <p className="text-sm text-muted-foreground font-medium ml-1">Jangan lewatkan informasi penting hari ini.</p>
                        </div>
                        <Button
                            variant="link"
                            className="font-black gap-2 text-primary hover:gap-3 transition-all"
                            onClick={() => window.location.href = '/siswa/berita'}
                        >
                            Lihat Semua Berita
                            <ChevronRight className="h-4 w-4" />
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
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
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
                                            <CardContent className="p-6 flex-1 flex flex-col justify-between">
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
                                <p className="text-muted-foreground font-bold italic text-sm">Belum ada pengumuman baru untukmu.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </DashboardLayout>
    );
}
