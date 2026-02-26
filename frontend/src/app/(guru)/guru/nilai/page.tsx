"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { BookOpen, Search, Save, Loader2, GraduationCap, ChevronRight, Calculator, FileDown, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { exportToPDF, exportToExcel } from "@/lib/export-utils";

// Type for our local grades state
type GradeState = Record<number, { uts: number | string, uas: number | string }>;

export default function GuruNilaiPage() {
    const queryClient = useQueryClient();
    const [selectedTeach, setSelectedTeach] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [grades, setGrades] = useState<GradeState>({});

    const { data: teachingData, isLoading } = useQuery({
        queryKey: ["guru-teaching-data"],
        queryFn: async () => {
            const response = await apiClient.get("/api/nilai/guru/me");
            return response.data;
        }
    });

    // Populate local state when a class is selected
    useEffect(() => {
        if (selectedTeach) {
            const initialGrades: GradeState = {};
            selectedTeach.students.forEach((s: any) => {
                initialGrades[s.id_siswa] = {
                    uts: s.nilai?.nilai_uts || 0,
                    uas: s.nilai?.nilai_uas || 0
                };
            });
            setGrades(initialGrades);
        }
    }, [selectedTeach]);

    const saveMutation = useMutation({
        mutationFn: async (data: any) => {
            await apiClient.post("/api/nilai/", data);
        },
        onSuccess: () => {
            // We don't necessarily need to invalidate immediately if we updated local state, 
            // but it's good practice to ensure sync.
            queryClient.invalidateQueries({ queryKey: ["guru-teaching-data"] });
            toast.success("Nilai berhasil disimpan!");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal menyimpan nilai.");
        }
    });

    const handleGradeChange = (id_siswa: number, field: 'uts' | 'uas', value: string) => {
        // Allow empty string for better typing experience, convert to number only when saving or valid
        const newValue = value === "" ? "" : parseInt(value);

        // Prevent negative numbers or non-numeric input (if parseInt returns NaN and not empty)
        if (value !== "" && (isNaN(newValue as number) || (newValue as number) < 0 || (newValue as number) > 100)) return;

        setGrades(prev => ({
            ...prev,
            [id_siswa]: {
                ...prev[id_siswa],
                [field]: newValue
            }
        }));
    };

    const saveGrade = (id_siswa: number) => {
        const studentGrade = grades[id_siswa];
        if (!studentGrade) return;

        saveMutation.mutate({
            id_siswa,
            id_mapel: selectedTeach.id_mapel,
            nilai_uts: studentGrade.uts === "" ? 0 : studentGrade.uts,
            nilai_uas: studentGrade.uas === "" ? 0 : studentGrade.uas
        });
    };

    // Calculate final grade for live preview
    const calculateFinal = (uts: number | string, uas: number | string) => {
        const nUts = uts === "" ? 0 : (uts as number);
        const nUas = uas === "" ? 0 : (uas as number);
        return Math.round((nUts + nUas) / 2);
    };

    if (isLoading) {
        return (
            <DashboardLayout role="Guru">
                <div className="flex h-[60vh] items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="Guru">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0">
                                <BookOpen className="h-6 w-6 md:h-8 md:w-8" />
                            </div>
                            Input Nilai Siswa
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground font-medium">Input nilai UTS dan UAS berdasarkan kelas pengampu.</p>
                    </div>
                </div>

                {!selectedTeach ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {teachingData?.map((t: any) => (
                            <motion.div
                                key={t.id_ampu}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Card
                                    className="glass-card border-primary/5 hover:border-primary/20 transition-all cursor-pointer overflow-hidden group"
                                    onClick={() => setSelectedTeach(t)}
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-bold">
                                                {t.mapel_nama}
                                            </Badge>
                                            <GraduationCap className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                        <CardTitle className="text-xl md:text-2xl font-black tracking-tight">{t.kelas_nama}</CardTitle>
                                        <CardDescription className="font-bold">{t.students.length} Siswa Terdaftar</CardDescription>
                                    </CardHeader>
                                    <div className="px-6 pb-6">
                                        <Button variant="ghost" className="w-full justify-between font-black text-xs uppercase tracking-widest group-hover:bg-primary group-hover:text-primary-foreground">
                                            Lanjutkan Pengisian
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <Card className="glass-card border-none overflow-hidden">
                            <CardHeader className="bg-primary/5 border-b border-primary/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setSelectedTeach(null)}
                                            className="rounded-full hover:bg-primary/10"
                                        >
                                            <ChevronRight className="h-5 w-5 rotate-180" />
                                        </Button>
                                        <div>
                                            <CardTitle className="text-xl md:text-2xl font-black">{selectedTeach.kelas_nama}</CardTitle>
                                            <CardDescription className="text-xs md:text-sm font-bold text-primary">{selectedTeach.mapel_nama}</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 mt-4 md:mt-0 flex-wrap">
                                        <div className="relative flex-1 md:flex-initial">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Cari..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="pl-9 h-10 w-full md:w-64 rounded-xl glass-input"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const columns = ["No", "Nama Siswa", "NISN", "Nilai UTS", "Nilai UAS", "Nilai Akhir"];
                                                const rows = selectedTeach.students.map((s: any, idx: number) => {
                                                    const g = grades[s.id_siswa] || { uts: 0, uas: 0 };
                                                    const final = Math.round(((g.uts === "" ? 0 : Number(g.uts)) + (g.uas === "" ? 0 : Number(g.uas))) / 2);
                                                    return [idx + 1, s.nama, s.nisn, g.uts, g.uas, final];
                                                });
                                                exportToPDF(columns, rows, `Nilai ${selectedTeach.kelas_nama} - ${selectedTeach.mapel_nama}`, `Nilai-${selectedTeach.kelas_nama}-${selectedTeach.mapel_nama}`);
                                            }}
                                            className="h-10 rounded-xl font-bold gap-2 border-primary/20 hover:bg-red-500/5 hover:border-red-500/30 hover:text-red-500 transition-all"
                                        >
                                            <FileDown className="h-4 w-4" />
                                            PDF
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                const headers = ["No", "Nama Siswa", "NISN", "Nilai UTS", "Nilai UAS", "Nilai Akhir"];
                                                const rows = selectedTeach.students.map((s: any, idx: number) => {
                                                    const g = grades[s.id_siswa] || { uts: 0, uas: 0 };
                                                    const final = Math.round(((g.uts === "" ? 0 : Number(g.uts)) + (g.uas === "" ? 0 : Number(g.uas))) / 2);
                                                    return [idx + 1, s.nama, s.nisn, g.uts, g.uas, final];
                                                });
                                                exportToExcel(headers, rows, `Nilai-${selectedTeach.kelas_nama}-${selectedTeach.mapel_nama}`, `Nilai ${selectedTeach.kelas_nama}`);
                                            }}
                                            className="h-10 rounded-xl font-bold gap-2 border-primary/20 hover:bg-green-500/5 hover:border-green-500/30 hover:text-green-500 transition-all"
                                        >
                                            <FileSpreadsheet className="h-4 w-4" />
                                            Excel
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="border-b border-primary/5 bg-muted/30">
                                                <th className="p-4 md:p-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-12 md:w-16">No</th>
                                                <th className="p-4 md:p-6 text-left text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Detail Siswa</th>
                                                <th className="p-4 md:p-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-24 md:w-32">UTS</th>
                                                <th className="p-4 md:p-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-24 md:w-32">UAS</th>
                                                <th className="p-4 md:p-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-24 md:w-32">Akhir</th>
                                                <th className="p-4 md:p-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground w-32 md:w-40">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedTeach.students
                                                .filter((s: any) => s.nama.toLowerCase().includes(search.toLowerCase()))
                                                .map((s: any, idx: number) => {
                                                    const currentGrade = grades[s.id_siswa] || { uts: 0, uas: 0 };
                                                    const finalScore = calculateFinal(currentGrade.uts, currentGrade.uas);

                                                    return (
                                                        <tr key={s.id_siswa} className="border-b border-primary/5 hover:bg-primary/[0.02] transition-colors group">
                                                            <td className="p-4 md:p-6 font-black text-muted-foreground/50 text-sm md:text-base">{idx + 1}</td>
                                                            <td className="p-4 md:p-6">
                                                                <div className="flex flex-col min-w-[120px]">
                                                                    <span className="font-black text-xs md:text-sm truncate">{s.nama}</span>
                                                                    <span className="text-[9px] md:text-[10px] font-bold text-muted-foreground">NISN: {s.nisn}</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 md:p-6 text-center">
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    max="100"
                                                                    value={currentGrade.uts}
                                                                    onChange={(e) => handleGradeChange(s.id_siswa, 'uts', e.target.value)}
                                                                    className="w-16 md:w-20 mx-auto h-10 md:h-12 text-center font-black text-sm md:text-lg bg-background rounded-xl border-primary/10 focus:ring-primary/20"
                                                                />
                                                            </td>
                                                            <td className="p-4 md:p-6 text-center">
                                                                <Input
                                                                    type="number"
                                                                    min="0"
                                                                    max="100"
                                                                    value={currentGrade.uas}
                                                                    onChange={(e) => handleGradeChange(s.id_siswa, 'uas', e.target.value)}
                                                                    className="w-16 md:w-20 mx-auto h-10 md:h-12 text-center font-black text-sm md:text-lg bg-background rounded-xl border-primary/10 focus:ring-primary/20"
                                                                />
                                                            </td>
                                                            <td className="p-4 md:p-6 text-center">
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <div className={cn(
                                                                        "h-10 w-16 md:h-12 md:w-20 flex items-center justify-center rounded-xl font-black text-sm md:text-lg",
                                                                        finalScore >= 75 ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                                                    )}>
                                                                        {finalScore}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-4 md:p-6 text-right">
                                                                <Button
                                                                    onClick={() => saveGrade(s.id_siswa)}
                                                                    disabled={saveMutation.isPending}
                                                                    className="rounded-xl font-bold h-10 md:h-12 px-4 md:px-6 gap-2"
                                                                >
                                                                    {saveMutation.isPending ? <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" /> : <Save className="h-3 w-3 md:h-4 md:w-4" />}
                                                                    <span className="hidden sm:inline">Simpan</span>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </div>
        </DashboardLayout>
    );
}
