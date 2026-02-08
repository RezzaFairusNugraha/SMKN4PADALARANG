"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    MoreVertical,
    GraduationCap,
    Loader2,
    Users,
    UserCircle2,
    Home,
    Calendar,
    ArrowRightCircle,
    Building2,
    Shield,
    Clock,
    AlertCircle
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function KelasPage() {
    const [search, setSearch] = useState("");
    const [selectedKelas, setSelectedKelas] = useState<any>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState({ kelas: "", jurusan: "" });
    const [editingKelas, setEditingKelas] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const { data: kelas, isLoading: loadingKelas } = useQuery({
        queryKey: ["kelas"],
        queryFn: async () => {
            const response = await apiClient.get("/api/kelas/");
            return response.data;
        },
    });

    const { data: allSiswa } = useQuery({
        queryKey: ["siswa-all"],
        queryFn: async () => {
            const response = await apiClient.get("/api/siswa/");
            return response.data;
        }
    });

    const { data: allGuru } = useQuery({
        queryKey: ["guru-all"],
        queryFn: async () => {
            const response = await apiClient.get("/api/guru/");
            return response.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (newData: any) => {
            await apiClient.post("/api/kelas/", newData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kelas"] });
            toast.success("Kelas baru berhasil ditambahkan! 🚀");
            setIsAddOpen(false);
            setFormData({ kelas: "", jurusan: "" });
        },
        onError: () => {
            toast.error("Gagal menambahkan kelas. Silakan coba lagi.");
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: any }) => {
            await apiClient.put(`/api/kelas/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kelas"] });
            toast.success("Data kelas berhasil diperbarui! 📝");
            setIsEditOpen(false);
            setEditingKelas(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal memperbarui kelas.");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/api/kelas/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kelas"] });
            toast.success("Data kelas berhasil dihapus");
            setDeleteId(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal menghapus kelas.");
            setDeleteId(null);
        }
    });

    const filteredKelas = kelas?.filter((k: any) =>
        k.kelas.toLowerCase().includes(search.toLowerCase()) ||
        k.jurusan.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (k: any) => {
        setEditingKelas(k);
        setFormData({ kelas: k.kelas, jurusan: k.jurusan });
        setIsEditOpen(true);
    };

    if (loadingKelas) {
        return (
            <DashboardLayout role="Admin">
                <div className="flex h-[60vh] items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="Admin">
            <div className="space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl">
                                <GraduationCap className="h-8 w-8 text-primary" />
                            </div>
                            Data Kelas
                        </h2>
                        <p className="text-muted-foreground font-medium">Manajemen rombongan belajar dan jurusan.</p>
                    </div>

                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="rounded-xl font-bold shadow-lg shadow-primary/20 gap-2 h-12 px-6 active:scale-95 transition-transform"
                    >
                        <Plus className="h-5 w-5" />
                        Tambah Kelas
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 bg-card/30 backdrop-blur-md p-4 rounded-2xl border border-primary/5 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari berdasarkan kelas atau jurusan..."
                            className="pl-12 h-12 rounded-xl border-none bg-background/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredKelas?.map((k: any, index: number) => {
                            const totalSiswa = allSiswa?.filter((s: any) => s.id_kelas === k.id_kelas).length || 0;
                            const waliKelas = allGuru?.find((g: any) => g.id_kelas === k.id_kelas)?.nama || "Belum ditentukan";

                            return (
                                <motion.div
                                    key={k.id_kelas}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                    <Card
                                        className="group relative overflow-hidden border border-primary/5 bg-card/40 hover:bg-card/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer rounded-[2rem]"
                                        onClick={() => setSelectedKelas(k)}
                                    >
                                        <div className="absolute top-2 right-2 z-10">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 h-10 w-10">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="glass rounded-2xl p-2 min-w-[180px] shadow-2xl border-primary/10">
                                                    <DropdownMenuItem
                                                        onClick={(e) => { e.stopPropagation(); handleEdit(k); }}
                                                        className="gap-2 font-bold cursor-pointer rounded-xl py-3 focus:bg-primary/10"
                                                    >
                                                        <Pencil className="h-4 w-4 text-blue-500" /> Edit Data Kelas
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 font-bold text-destructive cursor-pointer focus:bg-destructive/10 rounded-xl py-3"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteId(k.id_kelas);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" /> Hapus Permanen
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <CardContent className="p-8">
                                            <div className="flex flex-col space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-inner">
                                                        <Home className="h-7 w-7" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-2xl leading-none tracking-tight">
                                                            {k.kelas}
                                                        </h3>
                                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/50 mt-1">
                                                            ID: #{k.id_kelas}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <Badge variant="outline" className="font-black border-primary/10 text-primary bg-primary/5 px-4 py-1.5 rounded-xl text-[10px] uppercase tracking-wider">
                                                        {k.jurusan}
                                                    </Badge>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/80">
                                                        <div className="p-1 px-2 rounded-lg bg-muted flex items-center gap-1.5">
                                                            <Users className="h-3 w-3" />
                                                            <span>{totalSiswa} Siswa</span>
                                                        </div>
                                                        <div className="p-1 px-2 rounded-lg bg-muted flex items-center gap-1.5">
                                                            <UserCircle2 className="h-3 w-3" />
                                                            <span className="truncate max-w-[100px]">{waliKelas}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="pt-6 border-t border-primary/5 flex items-center justify-between">
                                                    <div className="flex -space-x-3">
                                                        {allSiswa?.filter((s: any) => s.id_kelas === k.id_kelas).slice(0, 4).map((s: any) => (
                                                            <div key={s.id_siswa} className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-[8px] font-bold shadow-sm overflow-hidden text-primary">
                                                                {s.nama.substring(0, 2).toUpperCase()}
                                                            </div>
                                                        ))}
                                                        {totalSiswa > 4 && (
                                                            <div className="h-8 w-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[8px] font-bold shadow-sm">
                                                                +{totalSiswa - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-2 rounded-full bg-primary/5 group-hover:bg-primary transition-colors duration-500">
                                                        <ArrowRightCircle className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-all" />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Add/Edit Class Sheet */}
                <Sheet open={isAddOpen || isEditOpen} onOpenChange={(open) => {
                    if (!open) {
                        setIsAddOpen(false);
                        setIsEditOpen(false);
                        setEditingKelas(null);
                        setFormData({ kelas: "", jurusan: "" });
                    }
                }}>
                    <SheetContent className="sm:max-w-xl bg-card/95 backdrop-blur-2xl border-l border-primary/10 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[100]">
                        <SheetHeader className="pb-8 border-b border-primary/5">
                            <div className="flex items-center gap-6 pt-4">
                                <div className="p-5 bg-primary/10 rounded-[2rem] text-primary shadow-inner">
                                    {isEditOpen ? <Pencil className="h-10 w-10" /> : <Plus className="h-10 w-10" />}
                                </div>
                                <div className="space-y-1">
                                    <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-[0.2em] text-[10px] mb-2 px-3 py-1">
                                        Data Management
                                    </Badge>
                                    <SheetTitle className="text-3xl font-black tracking-tighter uppercase">{isEditOpen ? "Edit Data Kelas" : "Tambah Kelas Baru"}</SheetTitle>
                                    <SheetDescription className="text-sm font-bold text-muted-foreground/80">
                                        {isEditOpen ? "Perbarui informasi rombongan belajar yang sudah terdaftar." : "Daftarkan rombongan belajar baru ke dalam sistem."}
                                    </SheetDescription>
                                </div>
                            </div>
                        </SheetHeader>

                        <div className="py-10 space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nama Kelas</label>
                                    <Input
                                        placeholder="Contoh: XII"
                                        value={formData.kelas || ""}
                                        onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-6 text-center"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Jurusan</label>
                                    <Input
                                        placeholder="Contoh: Rekayasa Perangkat Lunak"
                                        value={formData.jurusan || ""}
                                        onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold text-lg px-6"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-10 border-t border-primary/5">
                            <Button
                                variant="outline"
                                onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
                                className="flex-1 h-14 rounded-2xl font-black border-primary/10 hover:bg-muted"
                            >
                                Batalkan
                            </Button>
                            <Button
                                onClick={() => {
                                    if (isEditOpen) {
                                        updateMutation.mutate({ id: editingKelas.id_kelas, data: formData });
                                    } else {
                                        createMutation.mutate(formData);
                                    }
                                }}
                                disabled={createMutation.isPending || updateMutation.isPending || !formData.kelas || !formData.jurusan}
                                className="flex-1 h-14 rounded-2xl font-black shadow-xl shadow-primary/20 gap-2"
                            >
                                {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditOpen ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                {isEditOpen ? "Perbarui Kelas" : "Simpan Kelas"}
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Detail Sheet */}
                <Sheet open={!!selectedKelas} onOpenChange={() => setSelectedKelas(null)}>
                    <SheetContent className="sm:max-w-xl bg-card/95 backdrop-blur-2xl border-l border-primary/10 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[100]">
                        <SheetHeader className="pb-8 border-b border-primary/5">
                            <div className="flex items-center gap-6 pt-4">
                                <div className="p-5 bg-primary/10 rounded-[2rem] text-primary shadow-inner">
                                    <Home className="h-10 w-10" />
                                </div>
                                <div className="space-y-1">
                                    <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-[0.2em] text-[10px] mb-2 px-3 py-1">
                                        Data Rombongan Belajar
                                    </Badge>
                                    <SheetTitle className="text-3xl font-black tracking-tighter uppercase">{selectedKelas?.kelas}</SheetTitle>
                                    <p className="text-sm font-bold text-muted-foreground/80 flex items-center gap-2">
                                        <Building2 className="h-3.5 w-3.5 text-primary/40" />
                                        ID Kelas: #{selectedKelas?.id_kelas}
                                    </p>
                                </div>
                            </div>
                        </SheetHeader>

                        <div className="py-10 space-y-10">
                            <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                                <DetailItem icon={GraduationCap} label="Jurusan" value={selectedKelas?.jurusan} />
                                <DetailItem icon={UserCircle2} label="Wali Kelas" value={allGuru?.find((g: any) => g.id_kelas === selectedKelas?.id_kelas)?.nama || "Belum ditentukan"} />
                                <DetailItem icon={Users} label="Total Siswa" value={`${allSiswa?.filter((s: any) => s.id_kelas === selectedKelas?.id_kelas).length || 0} Siswa`} />
                                <DetailItem icon={Clock} label="Status Rombel" value="Aktif" />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-10 border-t border-primary/5">
                            <Button
                                onClick={() => handleEdit(selectedKelas)}
                                className="flex-1 rounded-2xl font-black gap-2 h-14 shadow-xl shadow-primary/20 active:scale-95 transition-all"
                            >
                                <Pencil className="h-4 w-4" /> Edit Kelas
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setSelectedKelas(null)}
                                className="flex-1 rounded-2xl font-black border-primary/10 hover:bg-muted h-14 active:scale-95 transition-all"
                            >
                                Tutup Detail
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>

                <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                    <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl p-10">
                        <AlertDialogHeader className="space-y-4 text-center">
                            <div className="mx-auto p-4 rounded-full bg-destructive/10 text-destructive w-fit">
                                <Trash2 className="h-8 w-8" />
                            </div>
                            <AlertDialogTitle className="text-2xl font-black tracking-tight">Hapus Data Kelas?</AlertDialogTitle>
                            <AlertDialogDescription className="text-lg font-medium">
                                Seluruh data kelas dan hubungan siswanya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-8 flex gap-4 sm:justify-center">
                            <AlertDialogCancel className="rounded-2xl font-black h-14 px-8 border-none hover:bg-muted transition-all flex-1">Batal</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                                className="rounded-2xl font-black h-14 px-8 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all flex-1"
                            >
                                Ya, Hapus
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div >
        </DashboardLayout >
    );
}

function DetailItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="space-y-1.5 group/item">
            <div className="flex items-center gap-2 text-muted-foreground group-hover/item:text-primary transition-colors">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className="font-bold text-sm tracking-tight">{value || "-"}</p>
        </div>
    );
}

