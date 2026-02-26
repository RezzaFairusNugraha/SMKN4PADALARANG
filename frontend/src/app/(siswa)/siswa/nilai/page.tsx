"use client";

import DashboardLayout from "@/components/dashboard-layout";
import { BookOpen, Loader2, Award, TrendingUp, BookCheck, ScrollText, FileDown, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { exportToPDF, exportToExcel } from "@/lib/export-utils";

export default function SiswaNilaiPage() {
    const { data: nilaiData, isLoading } = useQuery({
        queryKey: ["siswa-nilai"],
        queryFn: async () => {
            const response = await apiClient.get("/api/nilai/siswa/me");
            return response.data;
        }
    });

    const averageGrade = nilaiData?.length
        ? (nilaiData.reduce((acc: number, curr: any) => acc + (curr.nilai_akhir || 0), 0) / nilaiData.length).toFixed(1)
        : "0.0";

    const getGradeStatus = (score: number) => {
        if (score >= 85) return { label: "Sangat Baik", color: "text-emerald-500", bg: "bg-emerald-500/10" };
        if (score >= 75) return { label: "Baik", color: "text-blue-500", bg: "bg-blue-500/10" };
        if (score >= 60) return { label: "Cukup", color: "text-amber-500", bg: "bg-amber-500/10" };
        return { label: "Kurang", color: "text-rose-500", bg: "bg-rose-500/10" };
    };

    if (isLoading) {
        return (
            <DashboardLayout role="Siswa">
                <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground font-bold animate-pulse tracking-widest uppercase text-xs">Menyusun Laporan Nilai...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="Siswa">
            <div className="space-y-8 pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-black tracking-tighter flex items-center gap-4"
                        >
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
                                <ScrollText className="h-10 w-10" />
                            </div>
                            Hasil Belajar
                        </motion.h2>
                        <p className="text-muted-foreground font-medium text-lg ml-1">Laporan pencapaian akademik kamu semester ini.</p>
                    </div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap gap-4"
                    >
                        <div className="p-4 rounded-3xl flex items-center gap-4 px-6 bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                            <TrendingUp className="h-8 w-8 opacity-50" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Rata-rata</p>
                                <p className="text-3xl font-black tabular-nums">{averageGrade}</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-3xl flex items-center gap-4 px-6 bg-card border border-border shadow-sm">
                            <BookCheck className="h-8 w-8 text-primary opacity-50" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Mata Pelajaran</p>
                                <p className="text-3xl font-black tabular-nums text-foreground">{nilaiData?.length || 0}</p>
                            </div>
                        </div>
                        {nilaiData && nilaiData.length > 0 && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const columns = ["No", "Mata Pelajaran", "Kategori", "Nilai UTS", "Nilai UAS", "Nilai Akhir", "Status"];
                                        const rows = nilaiData.map((item: any, i: number) => [
                                            i + 1,
                                            item.mapel?.nama_mapel || "-",
                                            item.mapel?.kategori || "Umum",
                                            item.nilai_uts || 0,
                                            item.nilai_uas || 0,
                                            item.nilai_akhir || 0,
                                            item.nilai_akhir >= 75 ? "Lulus" : "Tidak Lulus"
                                        ]);
                                        exportToPDF(columns, rows, "Laporan Nilai Siswa", "Rapor-Nilai-Saya");
                                    }}
                                    className="p-4 rounded-3xl h-auto flex items-center gap-4 px-6 bg-card border border-border shadow-sm hover:bg-red-500/5 hover:border-red-500/30 hover:text-red-500 transition-all"
                                >
                                    <FileDown className="h-6 w-6 opacity-60" />
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Export</p>
                                        <p className="text-sm font-black">PDF</p>
                                    </div>
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        const headers = ["No", "Mata Pelajaran", "Kategori", "Nilai UTS", "Nilai UAS", "Nilai Akhir", "Status"];
                                        const rows = nilaiData.map((item: any, i: number) => [
                                            i + 1,
                                            item.mapel?.nama_mapel || "-",
                                            item.mapel?.kategori || "Umum",
                                            item.nilai_uts || 0,
                                            item.nilai_uas || 0,
                                            item.nilai_akhir || 0,
                                            item.nilai_akhir >= 75 ? "Lulus" : "Tidak Lulus"
                                        ]);
                                        exportToExcel(headers, rows, "Rapor-Nilai-Saya", "Nilai Saya");
                                    }}
                                    className="p-4 rounded-3xl h-auto flex items-center gap-4 px-6 bg-card border border-border shadow-sm hover:bg-green-500/5 hover:border-green-500/30 hover:text-green-500 transition-all"
                                >
                                    <FileSpreadsheet className="h-6 w-6 opacity-60" />
                                    <div className="text-left">
                                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Export</p>
                                        <p className="text-sm font-black">Excel</p>
                                    </div>
                                </Button>
                            </>
                        )}
                    </motion.div>
                </div>

                {/* Grades Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {nilaiData && nilaiData.length > 0 ? (
                        nilaiData.map((item: any, idx: number) => {
                            const status = getGradeStatus(item.nilai_akhir || 0);
                            return (
                                <motion.div
                                    key={item.id_nilai}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                >
                                    <Card className="group overflow-hidden border border-border/50 hover:border-primary/50 bg-card/60 backdrop-blur-xl shadow-xl rounded-[2.5rem] transition-all duration-500">
                                        <CardHeader className="pb-2 relative">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest", status.bg, status.color)}>
                                                    {status.label}
                                                </span>
                                            </div>
                                            <CardTitle className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors text-foreground">
                                                {item.mapel?.nama_mapel || "Mata Pelajaran"}
                                            </CardTitle>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.mapel?.kategori || "Umum"}</p>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-3 gap-4 bg-muted/40 dark:bg-muted/20 p-5 rounded-3xl border border-border/40">
                                                <div className="text-center">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">UTS</p>
                                                    <p className="text-xl font-black text-foreground">{item.nilai_uts || "-"}</p>
                                                </div>
                                                <div className="text-center border-x border-border/40">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">UAS</p>
                                                    <p className="text-xl font-black text-foreground">{item.nilai_uas || "-"}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">Akhir</p>
                                                    <p className="text-2xl font-black text-primary">{item.nilai_akhir || "-"}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-20 flex flex-col items-center justify-center gap-6 bg-card/40 backdrop-blur-md rounded-[3rem] border border-dashed border-border shadow-inner">
                            <div className="p-6 rounded-full bg-background border border-border shadow-xl">
                                <Award className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-black tracking-tight text-foreground/50">Belum Ada Nilai</h3>
                                <p className="text-muted-foreground font-medium max-w-[300px]">Nampaknya nilai mata pelajaran kamu belum diinput oleh pihak sekolah.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
