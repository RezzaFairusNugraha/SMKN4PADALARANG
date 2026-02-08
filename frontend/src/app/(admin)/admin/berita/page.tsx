"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard-layout";
import { Newspaper, Loader2, Plus, Pencil, Trash2, Calendar, User, ImagePlus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export default function AdminBeritaPage() {
    const { user: currentUser } = useAuth();
    const queryClient = useQueryClient();
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingBerita, setEditingBerita] = useState<any>(null);

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ judul: "", isi: "" });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const { data: berita, isLoading } = useQuery({
        queryKey: ["all-berita-admin"],
        queryFn: async () => {
            const response = await apiClient.get("/api/berita/");
            return response.data;
        }
    });

    const createMutation = useMutation({
        mutationFn: async (data: FormData) => {
            await apiClient.post("/api/berita/", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-berita-admin"] });
            toast.success("Berita berhasil dipublikasikan! 📰");
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
            queryClient.invalidateQueries({ queryKey: ["all-berita-admin"] });
            toast.success("Berita berhasil diperbarui! ✏️");
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
            queryClient.invalidateQueries({ queryKey: ["all-berita-admin"] });
            toast.success("Berita berhasil dihapus! 🗑️");
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

    const handleEdit = (item: any) => {
        setEditingBerita(item);
        setFormData({ judul: item.judul, isi: item.isi });
        if (item.gambar) {
            setImagePreview(`http://localhost:8000/api/uploads/${item.gambar}`);
        } else {
            setImagePreview(null);
        }
        setIsEditOpen(true);
    };

    return (
        <DashboardLayout role="Admin">
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
                            Pusat Informasi Utama
                        </motion.h2>
                        <p className="text-muted-foreground font-medium text-lg ml-1">Kelola semua pengumuman resmi sekolah di sini.</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Button
                            onClick={() => setIsAddOpen(true)}
                            className="rounded-2xl font-black gap-2 h-14 px-8 shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                        >
                            <Plus className="h-6 w-6" />
                            Buat Berita Baru
                        </Button>
                    </motion.div>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                            <div key={i} className="h-[400px] rounded-[2.5rem] bg-muted animate-pulse" />
                        ))
                    ) : berita?.length > 0 ? (
                        berita.map((item: any, idx: number) => (
                            <motion.div
                                key={item.id_berita}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Card className="group overflow-hidden border border-border/50 hover:border-primary/50 bg-card/60 backdrop-blur-xl shadow-xl rounded-[2.5rem] transition-all duration-500 h-[420px] flex flex-col">
                                    <div className="h-48 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative overflow-hidden shrink-0">
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
                                                Aktif
                                            </span>
                                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                                                Berita
                                            </span>
                                        </div>
                                    </div>

                                    <CardContent className="p-8 flex-1 flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                                    <Calendar className="h-3 w-3 text-primary" />
                                                    {format(new Date(item.tanggal_post), "dd MMM yyyy", { locale: id })}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase">
                                                    <User className="h-3 w-3" />
                                                    {item.nama_penulis} ({item.role_penulis})
                                                </div>
                                            </div>
                                            <h3 className="font-black text-2xl line-clamp-2 leading-tight group-hover:text-primary transition-colors text-foreground">
                                                {item.judul}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-medium capitalize">
                                                {item.isi}
                                            </p>
                                        </div>

                                        {(currentUser?.role === "Admin" || currentUser?.id_user === item.id_user) && (
                                            <div className="flex gap-3 mt-8">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 rounded-2xl font-black h-12 gap-2 border-border/50 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all font-sans"
                                                    onClick={() => handleEdit(item)}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="rounded-2xl font-black h-12 w-12 p-0 text-destructive hover:bg-destructive/10 hover:border-destructive/30 border-border/50 transition-all"
                                                    onClick={() => setDeleteId(item.id_berita)}
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center gap-8 bg-card/40 backdrop-blur-md rounded-[3rem] border border-dashed border-border shadow-inner">
                            <div className="p-8 rounded-full bg-background border border-border shadow-2xl scale-125">
                                <Newspaper className="h-12 w-12 text-muted-foreground/20" />
                            </div>
                            <div className="text-center space-y-3">
                                <h3 className="text-3xl font-black tracking-tight text-foreground/40">Belum Ada Informasi</h3>
                                <p className="text-muted-foreground font-medium max-w-[400px] text-lg">Mulai bagikan momen atau pengumuman penting sekolah kamu sekarang.</p>
                                <Button
                                    variant="link"
                                    onClick={() => setIsAddOpen(true)}
                                    className="text-primary font-black text-lg p-0 h-auto"
                                >
                                    Tulis berita pertama &rarr;
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
                            <SheetTitle className="text-3xl font-black tracking-tight leading-none">
                                {isEditOpen ? "Perbarui Informasi" : "Publikasikan Kabar Baru"}
                            </SheetTitle>
                            <SheetDescription className="text-lg font-medium mt-2">
                                {isEditOpen ? "Sesuaikan detail pengumuman yang sudah ada." : "Bagikan informasi penting kepada seluruh warga sekolah secara instan."}
                            </SheetDescription>
                        </div>
                    </SheetHeader>

                    <div className="space-y-8 mt-12 px-6">
                        <div className="space-y-3">
                            <label className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Judul Berita</label>
                            <Input
                                placeholder="Masukkan judul berita yang menarik..."
                                value={formData.judul}
                                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                className="h-16 rounded-2xl border-none bg-muted/50 focus:bg-background transition-all text-xl font-bold px-6"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Gambar Berita</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className={cn(
                                        "flex flex-col items-center justify-center w-full h-48 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer overflow-hidden",
                                        imagePreview ? "border-primary/50 bg-background" : "border-border hover:border-primary/40 bg-muted/30"
                                    )}
                                >
                                    {imagePreview ? (
                                        <div className="relative w-full h-full">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white font-black text-xs uppercase tracking-widest">Ubah Gambar</span>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-4 right-4 rounded-xl h-8 w-8"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedFile(null);
                                                    setImagePreview(null);
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                                                <ImagePlus className="h-6 w-6" />
                                            </div>
                                            <span className="text-xs font-bold text-muted-foreground">Pilih Foto Menarik</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Konten Utama</label>
                            <Textarea
                                placeholder="Tuliskan isi berita atau pengumuman secara detail di sini..."
                                value={formData.isi}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, isi: e.target.value })}
                                className="min-h-[250px] rounded-3xl border-none bg-muted/50 focus:bg-background transition-all text-lg font-medium p-6 resize-none"
                            />
                        </div>

                        <div className="flex gap-4 pt-6">
                            <Button
                                variant="ghost"
                                className="flex-1 rounded-2xl font-black h-16 text-lg hover:bg-muted/50 transition-all font-sans"
                                onClick={() => {
                                    setIsAddOpen(false);
                                    setIsEditOpen(false);
                                    resetForm();
                                }}
                            >
                                Batal
                            </Button>
                            <Button
                                className="flex-1 rounded-2xl font-black h-16 text-lg gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all font-sans"
                                onClick={handleSubmit}
                                disabled={createMutation.isPending || updateMutation.isPending}
                            >
                                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-5 w-5 animate-spin" />}
                                {isEditOpen ? "Simpan Perubahan" : "Publikasikan Sekarang"}
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="rounded-[2.5rem] border-none shadow-2xl p-10">
                    <AlertDialogHeader className="space-y-4">
                        <div className="mx-auto p-4 rounded-full bg-destructive/10 text-destructive w-fit">
                            <Trash2 className="h-8 w-8" />
                        </div>
                        <div className="text-center">
                            <AlertDialogTitle className="text-2xl font-black tracking-tight leading-none">Hapus Berita Ini?</AlertDialogTitle>
                            <AlertDialogDescription className="text-lg font-medium mt-4">
                                Tindakan ini bersifat permanen. Data berita akan dihapus sepenuhnya dari pusat informasi sekolah.
                            </AlertDialogDescription>
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 flex gap-4 sm:justify-center">
                        <AlertDialogCancel className="rounded-2xl font-black h-14 px-8 border-none hover:bg-muted transition-all flex-1 font-sans">Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                            className="rounded-2xl font-black h-14 px-8 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all flex-1 font-sans"
                        >
                            Ya, Hapus Permanen
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DashboardLayout>
    );
}
