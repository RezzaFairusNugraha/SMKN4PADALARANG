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
    Users,
    Loader2,
    Mail,
    User,
    Calendar,
    MapPin,
    Phone,
    GraduationCap,
    Clock,
    Shield,
    AlertCircle,
    FileDown,
    FileSpreadsheet
} from "lucide-react";
import { exportToPDF, exportToExcel } from "@/lib/export-utils";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function SiswaPage() {
    const [search, setSearch] = useState("");
    const [selectedSiswa, setSelectedSiswa] = useState<any>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState({
        nisn: "",
        nama: "",
        jenis_kelamin: "Laki-laki",
        id_kelas: null as number | null,
        alamat: "",
        no_hp: "",
        tanggal_lahir: ""
    });
    const [editingSiswa, setEditingSiswa] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const { data: siswa, isLoading } = useQuery({
        queryKey: ["siswa"],
        queryFn: async () => {
            const response = await apiClient.get("/api/siswa/");
            return response.data;
        },
    });

    const { data: kelas } = useQuery({
        queryKey: ["kelas"],
        queryFn: async () => {
            const response = await apiClient.get("/api/kelas/");
            return response.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (newData: any) => {
            await apiClient.post("/api/siswa/", newData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["siswa"] });
            toast.success("Siswa baru berhasil didaftarkan!");
            setIsAddOpen(false);
            setFormData({
                nisn: "",
                nama: "",
                jenis_kelamin: "Laki-laki",
                id_kelas: null,
                alamat: "",
                no_hp: "",
                tanggal_lahir: ""
            });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal mendaftarkan siswa.");
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: any }) => {
            await apiClient.put(`/api/siswa/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["siswa"] });
            toast.success("Data siswa berhasil diperbarui!");
            setIsEditOpen(false);
            setEditingSiswa(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal memperbarui siswa.");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/api/siswa/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["siswa"] });
            toast.success("Data siswa berhasil dihapus");
            setDeleteId(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal menghapus siswa.");
            setDeleteId(null);
        }
    });

    const handleEdit = (s: any) => {
        setEditingSiswa(s);
        setFormData({
            nisn: s.nisn,
            nama: s.nama,
            jenis_kelamin: s.jenis_kelamin,
            id_kelas: s.id_kelas,
            alamat: s.alamat || "",
            no_hp: s.no_hp || "",
            tanggal_lahir: s.tanggal_lahir || ""
        });
        setIsEditOpen(true);
    };

    const filteredSiswa = siswa?.filter((s: any) =>
        s.nama.toLowerCase().includes(search.toLowerCase()) ||
        s.nisn.includes(search)
    );

    if (isLoading) {
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
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                            Data Siswa
                        </h2>
                        <p className="text-muted-foreground font-medium">Manajemen data siswa seluruh angkatan.</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                const columns = ["No", "Nama", "NISN", "Jenis Kelamin", "Kelas", "Alamat", "No HP"];
                                const rows = (filteredSiswa || []).map((s: any, i: number) => [
                                    i + 1,
                                    s.nama,
                                    s.nisn,
                                    s.jenis_kelamin,
                                    kelas?.find((k: any) => k.id_kelas === s.id_kelas)?.kelas || "-",
                                    s.alamat || "-",
                                    s.no_hp || "-"
                                ]);
                                exportToPDF(columns, rows, "Daftar Siswa", "Data-Siswa");
                            }}
                            className="rounded-xl font-bold gap-2 h-12 px-5 border-primary/20 hover:bg-red-500/5 hover:border-red-500/30 hover:text-red-500 transition-all"
                        >
                            <FileDown className="h-4 w-4" />
                            PDF
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                const headers = ["No", "Nama", "NISN", "Jenis Kelamin", "Kelas", "Alamat", "No HP"];
                                const rows = (filteredSiswa || []).map((s: any, i: number) => [
                                    i + 1,
                                    s.nama,
                                    s.nisn,
                                    s.jenis_kelamin,
                                    kelas?.find((k: any) => k.id_kelas === s.id_kelas)?.kelas || "-",
                                    s.alamat || "-",
                                    s.no_hp || "-"
                                ]);
                                exportToExcel(headers, rows, "Data-Siswa", "Data Siswa");
                            }}
                            className="rounded-xl font-bold gap-2 h-12 px-5 border-primary/20 hover:bg-green-500/5 hover:border-green-500/30 hover:text-green-500 transition-all"
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            Excel
                        </Button>
                        <Button
                            onClick={() => setIsAddOpen(true)}
                            className="rounded-xl font-bold shadow-lg shadow-primary/20 gap-2 h-12 px-6 active:scale-95 transition-transform"
                        >
                            <Plus className="h-5 w-5" />
                            Tambah Siswa
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 bg-card/30 backdrop-blur-md p-4 rounded-2xl border border-primary/5 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari berdasarkan nama atau NISN..."
                            className="pl-12 h-12 rounded-xl border-none bg-background/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredSiswa?.map((s: any, index: number) => {
                            const kelasSiswa = kelas?.find((k: any) => k.id_kelas === s.id_kelas);
                            return (
                                <motion.div
                                    key={s.id_siswa}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                >
                                    <Card
                                        className="group relative overflow-hidden border border-primary/5 bg-card/40 hover:bg-card/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer rounded-[2.5rem]"
                                        onClick={() => setSelectedSiswa(s)}
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
                                                        onClick={(e) => { e.stopPropagation(); handleEdit(s); }}
                                                        className="gap-2 font-bold cursor-pointer rounded-xl py-3 focus:bg-primary/10"
                                                    >
                                                        <Pencil className="h-4 w-4 text-blue-500" /> Edit Biodata Siswa
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="gap-2 font-bold text-destructive cursor-pointer focus:bg-destructive/10 rounded-xl py-3"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteId(s.id_siswa);
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" /> Hapus Pelajar
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>

                                        <CardContent className="p-8">
                                            <div className="flex flex-col items-center text-center space-y-6">
                                                <div className="relative group/avatar">
                                                    <Avatar className="h-28 w-28 border-4 border-background shadow-2xl ring-2 ring-primary/10 group-hover/avatar:ring-primary/30 transition-all duration-500">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${s.nama}`} />
                                                        <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">
                                                            {s.nama.substring(0, 2).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className={cn(
                                                        "absolute -bottom-1 -right-1 h-8 w-8 border-4 border-background rounded-full shadow-lg",
                                                        s.jenis_kelamin === "Laki-laki" ? "bg-blue-500" : "bg-pink-500"
                                                    )} />
                                                </div>

                                                <div className="space-y-2">
                                                    <h3 className="font-black text-xl leading-tight tracking-tight group-hover:text-primary transition-colors">
                                                        {s.nama}
                                                    </h3>
                                                    <Badge variant="outline" className="font-black border-primary/10 text-primary bg-primary/5 px-4 py-1 rounded-xl text-[10px] uppercase tracking-widest">
                                                        NISN: {s.nisn}
                                                    </Badge>
                                                </div>

                                                <div className="w-full pt-6 grid grid-cols-2 gap-3 border-t border-primary/5">
                                                    <div className="flex flex-col items-center p-3 rounded-2xl bg-primary/5 border border-transparent hover:border-primary/10 transition-colors">
                                                        <GraduationCap className="h-4 w-4 text-primary/60 mb-1" />
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 leading-none mb-1">Kelas</span>
                                                        <span className="text-xs font-black truncate w-full">{kelasSiswa ? `${kelasSiswa.kelas}` : "-"}</span>
                                                    </div>
                                                    <div className="flex flex-col items-center p-3 rounded-2xl bg-primary/5 border border-transparent hover:border-primary/10 transition-colors">
                                                        <Shield className="h-4 w-4 text-primary/60 mb-1" />
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60 leading-none mb-1">Status</span>
                                                        <span className="text-xs font-black text-green-500">AKTIF</span>
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

                {/* Add/Edit Siswa Sheet */}
                <Sheet open={isAddOpen || isEditOpen} onOpenChange={(open) => {
                    if (!open) {
                        setIsAddOpen(false);
                        setIsEditOpen(false);
                        setEditingSiswa(null);
                        setFormData({
                            nisn: "",
                            nama: "",
                            jenis_kelamin: "Laki-laki",
                            id_kelas: null,
                            alamat: "",
                            no_hp: "",
                            tanggal_lahir: ""
                        });
                    }
                }}>
                    <SheetContent className="sm:max-w-xl bg-card/95 backdrop-blur-2xl border-l border-primary/10 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[100] overflow-y-auto">
                        <SheetHeader className="pb-8 border-b border-primary/5">
                            <div className="flex items-center gap-6 pt-4">
                                <div className="p-5 bg-primary/10 rounded-[2rem] text-primary shadow-inner">
                                    {isEditOpen ? <Pencil className="h-10 w-10" /> : <Plus className="h-10 w-10" />}
                                </div>
                                <div className="space-y-1">
                                    <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-[0.2em] text-[10px] mb-2 px-3 py-1">
                                        Student Enrollment
                                    </Badge>
                                    <SheetTitle className="text-3xl font-black tracking-tighter uppercase">{isEditOpen ? "Perbarui Data Siswa" : "Daftarkan Siswa"}</SheetTitle>
                                    <SheetDescription className="text-sm font-bold text-muted-foreground/80">
                                        {isEditOpen ? "Update informasi murid dalam database akademik." : "Input data murid baru ke dalam database akademik."}
                                    </SheetDescription>
                                </div>
                            </div>
                        </SheetHeader>

                        <div className="py-10 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">NISN (Username)</label>
                                    <Input
                                        placeholder="Contoh: 0065..."
                                        value={formData.nisn || ""}
                                        onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-6"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nama Lengkap</label>
                                    <Input
                                        placeholder="Nama Murid"
                                        value={formData.nama || ""}
                                        onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-6"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Jenis Kelamin</label>
                                    <div className="flex gap-2">
                                        {["Laki-laki", "Perempuan"].map((jk) => (
                                            <Button
                                                key={jk}
                                                type="button"
                                                variant={formData.jenis_kelamin === jk ? "default" : "outline"}
                                                onClick={() => setFormData({ ...formData, jenis_kelamin: jk as any })}
                                                className="flex-1 h-12 rounded-xl font-bold"
                                            >
                                                {jk}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Pilih Rombel / Kelas</label>
                                    <select
                                        className="w-full h-14 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-bold px-6 appearance-none"
                                        value={formData.id_kelas || ""}
                                        onChange={(e) => setFormData({ ...formData, id_kelas: e.target.value ? parseInt(e.target.value) : null })}
                                    >
                                        <option value="">Belum Memiliki Kelas</option>
                                        {kelas?.map((k: any) => (
                                            <option key={k.id_kelas} value={k.id_kelas}>{k.kelas} - {k.jurusan}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Alamat Domisili</label>
                                    <Input
                                        placeholder="Alamat Lengkap"
                                        value={formData.alamat || ""}
                                        onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                                        className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-6"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nomor HP</label>
                                        <Input
                                            placeholder="08..."
                                            value={formData.no_hp || ""}
                                            onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                                            className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-6"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Tanggal Lahir</label>
                                        <Input
                                            type="date"
                                            value={formData.tanggal_lahir || ""}
                                            onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                                            className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-6 appearance-none"
                                        />
                                    </div>
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
                                        updateMutation.mutate({ id: editingSiswa.id_siswa, data: formData });
                                    } else {
                                        createMutation.mutate(formData);
                                    }
                                }}
                                disabled={createMutation.isPending || updateMutation.isPending || !formData.nisn || !formData.nama}
                                className="flex-1 h-14 rounded-2xl font-black shadow-xl shadow-primary/20 gap-2"
                            >
                                {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditOpen ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                {isEditOpen ? "Perbarui Data" : "Simpan Data"}
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Detail Sheet */}
                <Sheet open={!!selectedSiswa} onOpenChange={() => setSelectedSiswa(null)}>
                    <SheetContent className="sm:max-w-xl bg-card/95 backdrop-blur-2xl border-l border-primary/10 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[100] overflow-y-auto">
                        <SheetHeader className="pb-8 border-b border-primary/5">
                            <div className="flex items-center gap-6 pt-4">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-2xl ring-2 ring-primary/20">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedSiswa?.nama}`} />
                                    <AvatarFallback>{selectedSiswa?.nama?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-[0.2em] text-[10px] mb-2 px-3 py-1">
                                        Verified Student Profile
                                    </Badge>
                                    <SheetTitle className="text-3xl font-black tracking-tighter uppercase">{selectedSiswa?.nama}</SheetTitle>
                                    <p className="text-sm font-bold text-primary flex items-center gap-2">
                                        NISN: {selectedSiswa?.nisn}
                                    </p>
                                </div>
                            </div>
                        </SheetHeader>

                        <div className="py-10 space-y-10">
                            <div className="grid grid-cols-2 gap-y-10 gap-x-6">
                                <DetailItem icon={GraduationCap} label="Rombongan Belajar" value={kelas?.find((k: any) => k.id_kelas === selectedSiswa?.id_kelas)?.kelas} />
                                <DetailItem icon={User} label="Jenis Kelamin" value={selectedSiswa?.jenis_kelamin} />
                                <DetailItem icon={Calendar} label="Tanggal Lahir" value={selectedSiswa?.tanggal_lahir} />
                                <DetailItem icon={Phone} label="Nomor Telepon" value={selectedSiswa?.no_hp} />
                                <DetailItem icon={MapPin} label="Alamat Domisili" value={selectedSiswa?.alamat} />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-10 border-t border-primary/5">
                            <Button
                                onClick={() => handleEdit(selectedSiswa)}
                                className="flex-1 rounded-2xl font-black gap-2 h-14 shadow-xl shadow-primary/20 active:scale-95 transition-all"
                            >
                                <Pencil className="h-4 w-4" /> Edit Siswa
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setSelectedSiswa(null)}
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
                            <AlertDialogTitle className="text-2xl font-black tracking-tight">Hapus Data Siswa?</AlertDialogTitle>
                            <AlertDialogDescription className="text-lg font-medium">
                                Seluruh data profil dan akademik siswa ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
            </div>
        </DashboardLayout>
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

