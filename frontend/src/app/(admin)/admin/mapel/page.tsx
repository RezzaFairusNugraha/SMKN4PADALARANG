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
    BookOpen,
    Loader2,
    Layers,
    Clock,
    User,
    Award,
    Bookmark,
    CheckCircle2,
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

export default function MapelPage() {
    const [search, setSearch] = useState("");
    const [selectedMapel, setSelectedMapel] = useState<any>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState({
        nama_mapel: "",
        kategori: "Umum"
    });
    const [editingMapel, setEditingMapel] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const { data: mapel, isLoading } = useQuery({
        queryKey: ["mapel"],
        queryFn: async () => {
            const response = await apiClient.get("/api/mapel/");
            return response.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (newData: any) => {
            await apiClient.post("/api/mapel/", newData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mapel"] });
            toast.success("Mata pelajaran baru ditambahkan! 📚");
            setIsAddOpen(false);
            setFormData({ nama_mapel: "", kategori: "Umum" });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal menambahkan mapel.");
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: any }) => {
            await apiClient.put(`/api/mapel/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mapel"] });
            toast.success("Mata pelajaran berhasil diperbarui! 📝");
            setIsEditOpen(false);
            setEditingMapel(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal memperbarui mapel.");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/api/mapel/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["mapel"] });
            toast.success("Mata pelajaran berhasil dihapus");
            setDeleteId(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal menghapus mata pelajaran.");
            setDeleteId(null);
        }
    });

    const handleEdit = (m: any) => {
        setEditingMapel(m);
        setFormData({
            nama_mapel: m.nama_mapel,
            kategori: m.kategori || "Umum"
        });
        setIsEditOpen(true);
        setSelectedMapel(null); // Close detail sheet if open
    };

    const filteredMapel = mapel?.filter((m: any) =>
        m.nama_mapel.toLowerCase().includes(search.toLowerCase())
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
                                <BookOpen className="h-8 w-8 text-primary" />
                            </div>
                            Mata Pelajaran
                        </h2>
                        <p className="text-muted-foreground font-medium">Daftar mata pelajaran yang tersedia di kurikulum.</p>
                    </div>

                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="rounded-xl font-bold shadow-lg shadow-primary/20 gap-2 h-12 px-6"
                    >
                        <Plus className="h-5 w-5" />
                        Tambah Mapel
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 bg-card/30 backdrop-blur-md p-4 rounded-2xl border border-primary/5 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari mata pelajaran..."
                            className="pl-12 h-12 rounded-xl border-none bg-background/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredMapel?.map((m: any, index: number) => (
                            <motion.div
                                key={m.id_mapel}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <Card
                                    className="group relative overflow-hidden border-primary/5 bg-card/50 hover:bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer rounded-3xl"
                                    onClick={() => setSelectedMapel(m)}
                                >
                                    <div className="absolute top-0 right-0 p-4 z-10">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="glass rounded-xl p-2 min-w-[160px] shadow-2xl border-primary/10">
                                                <DropdownMenuItem
                                                    onClick={(e) => { e.stopPropagation(); handleEdit(m); }}
                                                    className="gap-2 font-bold cursor-pointer rounded-lg py-2.5"
                                                >
                                                    <Pencil className="h-4 w-4 text-blue-500" /> Edit Mapel
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="gap-2 font-bold text-destructive cursor-pointer focus:bg-destructive/10 rounded-lg py-2.5"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteId(m.id_mapel);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" /> Hapus Data
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <CardContent className="p-6">
                                        <div className="flex flex-col space-y-4">
                                            <div className="p-3 bg-primary/10 rounded-2xl w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                                <BookOpen className="h-6 w-6" />
                                            </div>

                                            <div className="space-y-1">
                                                <h3 className="font-black text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
                                                    {m.nama_mapel}
                                                </h3>
                                                <Badge variant="secondary" className={cn(
                                                    "font-bold border-none px-3 py-1",
                                                    m.kategori === "Umum" ? "bg-blue-500/10 text-blue-500" : "bg-violet-500/10 text-violet-500"
                                                )}>
                                                    {m.kategori || "Umum"}
                                                </Badge>
                                            </div>

                                            <div className="w-full pt-4 space-y-3 border-t border-primary/5">
                                                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                                                    <div className="flex items-center gap-1.5 text-primary">
                                                        <Layers className="h-3.5 w-3.5 opacity-50" />
                                                        <span>ID: #{m.id_mapel}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Add/Edit Mapel Sheet */}
                <Sheet open={isAddOpen || isEditOpen} onOpenChange={(open) => {
                    if (!open) {
                        setIsAddOpen(false);
                        setIsEditOpen(false);
                        setEditingMapel(null);
                        setFormData({ nama_mapel: "", kategori: "Umum" });
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
                                        Curriculum Management
                                    </Badge>
                                    <SheetTitle className="text-3xl font-black tracking-tighter uppercase">{isEditOpen ? "Perbarui Mapel" : "Tambah Mapel"}</SheetTitle>
                                    <SheetDescription className="text-sm font-bold text-muted-foreground/80">
                                        {isEditOpen ? "Update informasi mata pelajaran." : "Tambahkan mata pelajaran baru ke dalam kurikulum."}
                                    </SheetDescription>
                                </div>
                            </div>
                        </SheetHeader>

                        <div className="py-10 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nama Mata Pelajaran</label>
                                <Input
                                    placeholder="Contoh: Matematika, Fisika..."
                                    value={formData.nama_mapel || ""}
                                    onChange={(e) => setFormData({ ...formData, nama_mapel: e.target.value })}
                                    className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-6"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Kategori</label>
                                <div className="flex gap-2">
                                    {["Umum", "Kejuruan"].map((cat) => (
                                        <Button
                                            key={cat}
                                            type="button"
                                            variant={formData.kategori === cat ? "default" : "outline"}
                                            onClick={() => setFormData({ ...formData, kategori: cat })}
                                            className="flex-1 h-12 rounded-xl font-bold"
                                        >
                                            {cat}
                                        </Button>
                                    ))}
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
                                        updateMutation.mutate({ id: editingMapel.id_mapel, data: formData });
                                    } else {
                                        createMutation.mutate(formData);
                                    }
                                }}
                                disabled={createMutation.isPending || updateMutation.isPending || !formData.nama_mapel}
                                className="flex-1 h-14 rounded-2xl font-black shadow-xl shadow-primary/20 gap-2"
                            >
                                {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditOpen ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                {isEditOpen ? "Perbarui Data" : "Simpan Data"}
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Detail Sheet */}
                <Sheet open={!!selectedMapel} onOpenChange={() => setSelectedMapel(null)}>
                    <SheetContent className="sm:max-w-xl glass border-l border-primary/10">
                        <SheetHeader className="pb-8 border-b border-primary/5">
                            <div className="flex items-center gap-6">
                                <div className="p-4 bg-primary/10 rounded-3xl text-primary">
                                    <BookOpen className="h-10 w-10" />
                                </div>
                                <div className="space-y-1">
                                    <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-widest text-[10px] mb-2 px-3 py-1">
                                        Detail Mata Pelajaran
                                    </Badge>
                                    <SheetTitle className="text-2xl font-black">{selectedMapel?.nama_mapel}</SheetTitle>
                                    <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                                        <Layers className="h-3.5 w-3.5 text-primary/40" />
                                        ID: #{selectedMapel?.id_mapel}
                                    </p>
                                </div>
                            </div>
                        </SheetHeader>

                        <div className="py-8 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <DetailItem icon={Layers} label="Kategori" value={selectedMapel?.kategori} />
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8 pt-8 border-t border-primary/5">
                            <Button
                                onClick={() => handleEdit(selectedMapel)}
                                className="flex-1 rounded-2xl font-black gap-2 h-12 shadow-xl shadow-primary/20 active:scale-95 transition-all"
                            >
                                <Pencil className="h-4 w-4" /> Edit Mapel
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setSelectedMapel(null)}
                                className="flex-1 rounded-2xl font-black border-primary/10 hover:bg-primary/5 h-12"
                            >
                                Tutup
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
                            <AlertDialogTitle className="text-2xl font-black tracking-tight">Hapus Mata Pelajaran?</AlertDialogTitle>
                            <AlertDialogDescription className="text-lg font-medium">
                                Data mata pelajaran ini akan dihapus permanen dari kurikulum. Tindakan ini tidak dapat dibatalkan.
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
            <p className="font-bold text-sm">{value || "-"}</p>
        </div>
    );
}
