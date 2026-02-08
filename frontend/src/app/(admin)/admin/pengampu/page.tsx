"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Search,
    Trash2,
    Loader2,
    GraduationCap,
    BookOpen,
    Users,
    Filter,
    MoreVertical,
    Clock,
    CheckCircle2,
    AlertCircle,
    UserSquare2,
    Layers,
    Pencil,
    Save
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";

export default function PengampuPage() {
    const [search, setSearch] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedGuru, setSelectedGuru] = useState<string>("");
    const [selectedMapel, setSelectedMapel] = useState<string>("");
    const [selectedKelas, setSelectedKelas] = useState<string>("");
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingAssignment, setEditingAssignment] = useState<any>(null);
    const queryClient = useQueryClient();

    const { data: assignments, isLoading } = useQuery({
        queryKey: ["mapel-diampu"],
        queryFn: async () => {
            const response = await apiClient.get("/api/mapel/diampu/list");
            return response.data;
        },
    });

    const { data: gurus } = useQuery({
        queryKey: ["guru"],
        queryFn: async () => (await apiClient.get("/api/guru/")).data,
    });

    const { data: mapels } = useQuery({
        queryKey: ["mapel"],
        queryFn: async () => (await apiClient.get("/api/mapel/")).data,
    });

    const { data: kelas } = useQuery({
        queryKey: ["kelas"],
        queryFn: async () => (await apiClient.get("/api/kelas/")).data,
    });

    const createMutation = useMutation({
        mutationFn: async (newData: any) => {
            await apiClient.post("/api/mapel/diampu/", newData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mapel-diampu"] });
            toast.success("Pengampu berhasil ditambahkan! 🔗");
            setIsAddOpen(false);
            setSelectedGuru("");
            setSelectedMapel("");
            setSelectedKelas("");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal menambahkan pengampu.");
        }
    });

    const editMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: any }) => {
            await apiClient.put(`/api/mapel/diampu/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mapel-diampu"] });
            toast.success("Pengampu berhasil diperbarui! 📝");
            setIsEditOpen(false);
            setEditingAssignment(null);
            setSelectedGuru("");
            setSelectedMapel("");
            setSelectedKelas("");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal memperbarui pengampu.");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/api/mapel/diampu/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mapel-diampu"] });
            toast.success("Penugasan berhasil dihapus! 🗑️");
            setDeleteId(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal menghapus penugasan.");
            setDeleteId(null);
        }
    });

    const handleCreate = () => {
        if (!selectedGuru || !selectedMapel || !selectedKelas) {
            toast.error("Semua data (Guru, Mapel, Kelas) wajib dipilih! ⚠️");
            return;
        }

        const id_guru = parseInt(selectedGuru);
        const id_mapel = parseInt(selectedMapel);
        const id_kelas = parseInt(selectedKelas);

        if (isNaN(id_guru) || isNaN(id_mapel) || isNaN(id_kelas)) {
            toast.error("Format data tidak valid. Silakan coba lagi.");
            return;
        }

        createMutation.mutate({
            id_guru,
            id_mapel,
            id_kelas
        });
    };

    const handleEdit = (assignment: any) => {
        setEditingAssignment(assignment);
        setSelectedGuru(assignment.id_guru?.toString() || "");
        setSelectedMapel(assignment.id_mapel?.toString() || "");
        setSelectedKelas(assignment.id_kelas?.toString() || "");
        setIsEditOpen(true);
    };

    const handleUpdate = () => {
        if (!selectedGuru || !selectedMapel || !selectedKelas || !editingAssignment) {
            toast.error("Semua data (Guru, Mapel, Kelas) wajib dipilih! ⚠️");
            return;
        }

        const id_guru = parseInt(selectedGuru);
        const id_mapel = parseInt(selectedMapel);
        const id_kelas = parseInt(selectedKelas);

        editMutation.mutate({
            id: editingAssignment.id_ampu,
            data: { id_guru, id_mapel, id_kelas }
        });
    };

    const filteredAssignments = assignments?.filter((a: any) =>
        a.guru?.nama?.toLowerCase().includes(search.toLowerCase()) ||
        a.mapel?.nama_mapel?.toLowerCase().includes(search.toLowerCase()) ||
        a.kelas?.kelas?.toLowerCase().includes(search.toLowerCase())
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
                            <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                <Users className="h-8 w-8" />
                            </div>
                            Data Pengampu
                        </h2>
                        <p className="text-muted-foreground font-medium">Atur guru pengampu untuk setiap mata pelajaran dan kelas.</p>
                    </div>

                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="rounded-xl font-bold shadow-lg shadow-primary/20 gap-2 h-12 px-6">
                                <Plus className="h-5 w-5" />
                                Tambah Pengampu
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md glass border-primary/10">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black">Tambah Pengampu</DialogTitle>
                                <DialogDescription className="font-bold text-muted-foreground">
                                    Hubungkan Guru dengan Mata Pelajaran dan Kelas.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Guru</label>
                                    <Select
                                        value={selectedGuru}
                                        onValueChange={setSelectedGuru}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-none font-bold">
                                            <SelectValue placeholder="Pilih Guru" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {gurus?.map((g: any) => (
                                                <SelectItem key={g.id_guru} value={g.id_guru.toString()} className="font-bold">
                                                    {g.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Mata Pelajaran</label>
                                    <Select
                                        value={selectedMapel}
                                        onValueChange={setSelectedMapel}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-none font-bold">
                                            <SelectValue placeholder="Pilih Mapel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mapels?.map((m: any) => (
                                                <SelectItem key={m.id_mapel} value={m.id_mapel.toString()} className="font-bold">
                                                    {m.nama_mapel} ({m.kategori})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Kelas</label>
                                    <Select
                                        value={selectedKelas}
                                        onValueChange={setSelectedKelas}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-none font-bold">
                                            <SelectValue placeholder="Pilih Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kelas?.map((k: any) => (
                                                <SelectItem key={k.id_kelas} value={k.id_kelas.toString()} className="font-bold">
                                                    {k.kelas} {k.jurusan}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button
                                onClick={handleCreate}
                                disabled={createMutation.isPending || !selectedGuru || !selectedMapel || !selectedKelas}
                                className="w-full h-12 rounded-xl font-black gap-2"
                            >
                                {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                Simpan Data
                            </Button>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                        <DialogContent className="sm:max-w-md glass border-primary/10">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black">Edit Pengampu</DialogTitle>
                                <DialogDescription className="font-bold text-muted-foreground">
                                    Perbarui hubungan Guru, Mata Pelajaran, dan Kelas.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-6 space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Guru</label>
                                    <Select
                                        value={selectedGuru}
                                        onValueChange={setSelectedGuru}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-none font-bold">
                                            <SelectValue placeholder="Pilih Guru" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {gurus?.map((g: any) => (
                                                <SelectItem key={g.id_guru} value={g.id_guru.toString()} className="font-bold">
                                                    {g.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Mata Pelajaran</label>
                                    <Select
                                        value={selectedMapel}
                                        onValueChange={setSelectedMapel}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-none font-bold">
                                            <SelectValue placeholder="Pilih Mapel" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mapels?.map((m: any) => (
                                                <SelectItem key={m.id_mapel} value={m.id_mapel.toString()} className="font-bold">
                                                    {m.nama_mapel} ({m.kategori})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-muted-foreground ml-1">Kelas</label>
                                    <Select
                                        value={selectedKelas}
                                        onValueChange={setSelectedKelas}
                                    >
                                        <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-none font-bold">
                                            <SelectValue placeholder="Pilih Kelas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {kelas?.map((k: any) => (
                                                <SelectItem key={k.id_kelas} value={k.id_kelas.toString()} className="font-bold">
                                                    {k.kelas} {k.jurusan}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button
                                onClick={handleUpdate}
                                disabled={editMutation.isPending || !selectedGuru || !selectedMapel || !selectedKelas}
                                className="w-full h-12 rounded-xl font-black gap-2"
                            >
                                {editMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                Perbarui Data
                            </Button>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 bg-card/30 backdrop-blur-md p-4 rounded-2xl border border-primary/5 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari guru, mapel, atau kelas..."
                            className="pl-12 h-12 rounded-xl border-none bg-background/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredAssignments?.map((a: any, index: number) => (
                            <motion.div
                                key={a.id_ampu}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <Card className="group relative overflow-hidden border-primary/5 bg-card/50 hover:bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer rounded-3xl">
                                    <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                                            onClick={() => setDeleteId(a.id_ampu)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-primary hover:text-primary hover:bg-primary/10 rounded-xl"
                                            onClick={() => handleEdit(a)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <CardContent className="p-6 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div className="p-3 bg-primary/10 rounded-2xl text-primary group-hover:scale-110 transition-transform duration-500">
                                                <UserSquare2 className="h-6 w-6" />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="font-black text-lg line-clamp-1">{a.guru?.nama || "Guru Terhapus"}</h3>
                                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Guru Pengampu</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/5">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <BookOpen className="h-3.5 w-3.5" />
                                                    <span className="text-[10px] font-black uppercase tracking-wider">Mapel</span>
                                                </div>
                                                <p className="font-bold text-sm truncate" title={a.mapel?.nama_mapel}>
                                                    {a.mapel?.nama_mapel || "N/A"}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                                    <GraduationCap className="h-3.5 w-3.5" />
                                                    <span className="text-[10px] font-black uppercase tracking-wider">Kelas</span>
                                                </div>
                                                <p className="font-bold text-sm truncate">
                                                    {a.kelas ? `${a.kelas.kelas} ${a.kelas.jurusan}` : "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredAssignments?.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                        <Layers className="h-16 w-16 mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-black">Belum ada data pengampu</h3>
                        <p className="text-muted-foreground font-medium">Tambahkan pengampu baru untuk memulai.</p>
                    </div>
                )}
            </div>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl p-10">
                    <AlertDialogHeader className="space-y-4 text-center">
                        <div className="mx-auto p-4 rounded-full bg-destructive/10 text-destructive w-fit">
                            <Trash2 className="h-8 w-8" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight">Hapus Penugasan?</AlertDialogTitle>
                        <AlertDialogDescription className="text-lg font-medium">
                            Guru yang bersangkutan tidak akan lagi memiliki akses nilai untuk kelas dan mata pelajaran ini.
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
        </DashboardLayout>
    );
}
