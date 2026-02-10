"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Newspaper, Loader2, Search, Calendar, ChevronRight, X, Clock, Pencil, Trash2, Plus, ImagePlus, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
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
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";

export default function SiswaBeritaPage() {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBerita, setSelectedBerita] = useState<any>(null);

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingBerita, setEditingBerita] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ judul: "", isi: "" });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data: berita, isLoading } = useQuery({
        queryKey: ["siswa-berita"],
        queryFn: async () => {
            const response = await apiClient.get("/api/berita/");
            return response.data;
        }
    });

    const filteredBerita = berita?.filter((item: any) =>
        item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.isi.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const createMutation = useMutation({
        mutationFn: async (data: FormData) => {
            await apiClient.post("/api/berita/", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["siswa-berita"] });
            toast.success("Berita berhasil dipublikasikan!");
            setIsAddOpen(false);
            resetForm();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal mempublikasikan berita.");
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: FormData }) => {
            await apiClient.put(`/api/berita/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["siswa-berita"] });
            toast.success("Berita berhasil diperbarui!");
            setIsEditOpen(false);
            resetForm();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal memperbarui berita.");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/api/berita/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["siswa-berita"] });
            toast.success("Berita berhasil dihapus!");
            setDeleteId(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal menghapus berita.");
        }
    });

    const resetForm = () => {
        setFormData({ judul: "", isi: "" });
        setSelectedFile(null);
        setImagePreview(null);
        setEditingBerita(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        if (!formData.judul || !formData.isi) {
            toast.error("Judul dan isi berita harus diisi!");
            return;
        }

        const data = new FormData();
        data.append("judul", formData.judul);
        data.append("isi", formData.isi);
        if (selectedFile) {
            data.append("gambar", selectedFile);
        }

        if (isEditOpen && editingBerita) {
            updateMutation.mutate({ id: editingBerita.id_berita, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const handleEdit = (item: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingBerita(item);
        setFormData({ judul: item.judul, isi: item.isi });
        if (item.gambar) {
            setImagePreview(`http://localhost:8000/api/uploads/${item.gambar}`);
        } else {
            setImagePreview(null);
        }
        setIsEditOpen(true);
    };

    const handleDelete = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteId(id);
    };

    return (
        <DashboardLayout role="Siswa">
            <div className="space-y-8 pb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-black tracking-tighter flex items-center gap-4"
                        >
                            <div className="p-3 rounded-2xl bg-primary/10 text-primary shadow-inner">
                                <Newspaper className="h-10 w-10" />
                            </div>
                            Kabar Sekolah
                        </motion.h2>
                        <p className="text-muted-foreground font-medium text-lg ml-1">Jelajahi informasi and pengumuman terbaru hari ini.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Cari berita..."
                                className="pl-12 h-14 rounded-2xl border-border/50 bg-card/50 backdrop-blur-sm focus:ring-primary/20 transition-all font-medium"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={() => setIsAddOpen(true)}
                            className="rounded-2xl font-black gap-2 h-14 px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                        >
                            <Plus className="h-6 w-6" />
                            Tulis Kabar
                        </Button>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        Array(6).fill(0).map((_, i) => (
                            <div key={i} className="h-[400px] rounded-[2.5rem] bg-muted animate-pulse" />
                        ))
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredBerita?.map((item: any, idx: number) => (
                                <motion.div
                                    key={item.id_berita}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: idx * 0.05 }}
                                    layout
                                >
                                    <Card
                                        onClick={() => setSelectedBerita(item)}
                                        className="group cursor-pointer overflow-hidden border border-border/50 hover:border-primary/50 bg-card/60 backdrop-blur-xl shadow-xl rounded-[2.5rem] transition-all duration-500 h-[420px] flex flex-col"
                                    >
                                        <div className="h-48 bg-primary/5 relative overflow-hidden shrink-0">
                                            {item.gambar ? (
                                                <img
                                                    src={`http://localhost:8000/api/uploads/${item.gambar}`}
                                                    alt={item.judul}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-125 transition-transform duration-700">
                                                    <Newspaper className="h-32 w-32 text-primary" />
                                                </div>
                                            )}
                                            <div className="absolute top-6 left-6 flex gap-2">
                                                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                                                    {item.role_penulis === 'Admin' ? 'Pusat' : 'Kabar Siswa'}
                                                </span>
                                            </div>
                                        </div>

                                        <CardContent className="p-8 flex-1 flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                                        <Clock className="h-3 w-3 text-primary" />
                                                        {format(new Date(item.tanggal_post), "dd MMM yyyy", { locale: id })}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase">
                                                        <User className="h-3 w-3" />
                                                        {item.nama_penulis}
                                                    </div>
                                                </div>
                                                <h3 className="font-black text-2xl line-clamp-2 leading-tight group-hover:text-primary transition-colors text-foreground">
                                                    {item.judul}
                                                </h3>
                                                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-medium capitalize">
                                                    {item.isi}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-6 border-t border-border/40">
                                                <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Baca Selengkapnya
                                                    <ChevronRight className="h-4 w-4" />
                                                </span>
                                                {(currentUser?.role === "Admin" || currentUser?.id_user === item.id_user) && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-lg border-border/50 hover:bg-primary/10 hover:text-primary"
                                                            onClick={(e) => handleEdit(item, e)}
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-lg border-border/50 hover:bg-destructive/10 text-destructive"
                                                            onClick={(e) => handleDelete(item.id_berita, e)}
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}

                    {!isLoading && filteredBerita?.length === 0 && (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center gap-8 bg-card/40 backdrop-blur-md rounded-[3rem] border border-dashed border-border shadow-inner">
                            <div className="p-8 rounded-full bg-background border border-border">
                                <Search className="h-10 w-10 text-muted-foreground/30" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-black text-foreground/40 italic">Tidak ada berita ditemukan</h3>
                                <p className="text-muted-foreground font-medium">Coba gunakan kata kunci pencarian yang berbeda.</p>
                                <Button
                                    variant="link"
                                    onClick={() => setSearchQuery("")}
                                    className="text-primary font-black"
                                >
                                    Reset Pencarian
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Sheet open={isAddOpen || isEditOpen} onOpenChange={(open) => {
                if (!open) {
                    setIsAddOpen(false);
                    setIsEditOpen(false);
                    resetForm();
                }
            }}>
                <SheetContent className="sm:max-w-[600px] overflow-y-auto rounded-l-[3rem] border-none shadow-2xl bg-card">
                    <SheetHeader className="space-y-4 pt-8 px-6">
                        <div className="p-4 w-fit rounded-3xl bg-primary/10 text-primary">
                            <Newspaper className="h-8 w-8" />
                        </div>
                        <div>
                            <SheetTitle className="text-3xl font-black tracking-tight">
                                {isEditOpen ? "Update Kabar" : "Tulis Kabar Baru"}
                            </SheetTitle>
                            <SheetDescription className="text-lg font-medium">
                                Bagikan informasi atau momen menarik kamu kepada warga sekolah.
                            </SheetDescription>
                        </div>
                    </SheetHeader>

                    <div className="space-y-8 mt-12 px-6">
                        <div className="space-y-3">
                            <label className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Judul Kabar</label>
                            <Input
                                placeholder="Apa yang ingin kamu bagikan?"
                                value={formData.judul}
                                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                className="h-16 rounded-2xl border-none bg-muted/50 focus:bg-background transition-all text-xl font-bold px-6"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Gambar</label>
                            <div className="relative group">
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="siswa-image-upload" />
                                <label
                                    htmlFor="siswa-image-upload"
                                    className={cn(
                                        "flex flex-col items-center justify-center w-full h-48 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden",
                                        imagePreview ? "border-primary/50 bg-background" : "border-border hover:border-primary/40 bg-muted/30"
                                    )}
                                >
                                    {imagePreview ? (
                                        <div className="relative w-full h-full">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white font-black text-xs uppercase tracking-widest">Ganti Gambar</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <ImagePlus className="h-6 w-6 text-primary" />
                                            <span className="text-xs font-bold text-muted-foreground">Tambah Foto</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Konten</label>
                            <Textarea
                                placeholder="Ceritakan detail kabarmu di sini..."
                                value={formData.isi}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, isi: e.target.value })}
                                className="min-h-[200px] rounded-3xl border-none bg-muted/50 focus:bg-background transition-all text-lg font-medium p-6 resize-none"
                            />
                        </div>

                        <div className="flex gap-4 pt-6">
                            <Button variant="ghost" className="flex-1 rounded-2xl font-black h-16" onClick={resetForm}>Batal</Button>
                            <Button
                                className="flex-1 rounded-2xl font-black h-16 shadow-xl shadow-primary/20"
                                onClick={handleSubmit}
                                disabled={createMutation.isPending || updateMutation.isPending}
                            >
                                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-5 w-5 animate-spin" />}
                                {isEditOpen ? "Simpan Perubahan" : "Publikasikan"}
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-10">
                    <AlertDialogHeader className="space-y-4 text-center">
                        <div className="mx-auto p-4 rounded-full bg-destructive/10 text-destructive w-fit">
                            <Trash2 className="h-8 w-8" />
                        </div>
                        <AlertDialogTitle className="text-2xl font-black tracking-tight">Hapus Kabar?</AlertDialogTitle>
                        <AlertDialogDescription className="text-lg font-medium">
                            Kabar ini akan dihapus secara permanen dari sistem sekolah.
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
