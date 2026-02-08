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
    UserSquare2,
    Loader2,
    Mail,
    User,
    Calendar,
    MapPin,
    Phone,
    BookOpen
} from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";

export default function GuruPage() {
    const [search, setSearch] = useState("");
    const [selectedGuru, setSelectedGuru] = useState<any>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [formData, setFormData] = useState({
        nip: "",
        nama: "",
        jenis_kelamin: "Laki-laki" as any,
        email: "",
        no_hp: "",
        id_kelas: null as number | null,
        assignments: [] as { id_mapel: number; id_kelas: number }[]
    });
    const [editingGuru, setEditingGuru] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const queryClient = useQueryClient();

    const { data: guru, isLoading } = useQuery({
        queryKey: ["guru"],
        queryFn: async () => {
            const response = await apiClient.get("/api/guru/");
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

    const { data: mapel } = useQuery({
        queryKey: ["mapel"],
        queryFn: async () => {
            const response = await apiClient.get("/api/mapel/");
            return response.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: async (newData: any) => {
            await apiClient.post("/api/guru/", newData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["guru"] });
            toast.success("Guru baru berhasil ditambahkan! 🎓");
            setIsAddOpen(false);
            setFormData({
                nip: "",
                nama: "",
                jenis_kelamin: "Laki-laki",
                email: "",
                no_hp: "",
                id_kelas: null,
                assignments: []
            });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal menambahkan guru.");
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: number, data: any }) => {
            await apiClient.put(`/api/guru/${id}`, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["guru"] });
            toast.success("Data guru berhasil diperbarui! 📝");
            setIsEditOpen(false);
            setEditingGuru(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.detail || "Gagal memperbarui guru.");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await apiClient.delete(`/api/guru/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["guru"] });
            toast.success("Data guru berhasil dihapus");
            setDeleteId(null);
        },
    });

    const handleEdit = (g: any) => {
        setEditingGuru(g);
        setFormData({
            nip: g.nip,
            nama: g.nama,
            jenis_kelamin: g.jenis_kelamin,
            email: g.email,
            no_hp: g.no_hp,
            id_kelas: g.id_kelas,
            assignments: []
        });
        setIsEditOpen(true);
    };

    const filteredGuru = guru?.filter((g: any) =>
        g.nama.toLowerCase().includes(search.toLowerCase()) ||
        g.nip.includes(search)
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-xl shrink-0">
                                <UserSquare2 className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                            </div>
                            Data Guru
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground font-medium">Manajemen tenaga pengajar di institusi.</p>
                    </div>

                    <Button
                        onClick={() => setIsAddOpen(true)}
                        className="rounded-xl font-bold shadow-lg shadow-primary/20 gap-2 h-11 md:h-12 px-4 md:px-6 active:scale-95 transition-transform w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4 md:h-5 md:w-5" />
                        Tambah Guru
                    </Button>
                </div>

                <div className="flex items-center gap-4 bg-card/30 backdrop-blur-md p-4 rounded-2xl border border-primary/5 shadow-sm">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Cari berdasarkan nama atau NIP..."
                            className="pl-12 h-12 rounded-xl border-none bg-background/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredGuru?.map((g: any, index: number) => (
                            <motion.div
                                key={g.id_guru}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                                <Card
                                    className="group relative overflow-hidden border border-primary/5 bg-card/40 hover:bg-card/60 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer rounded-[2rem]"
                                    onClick={() => setSelectedGuru(g)}
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
                                                    onClick={(e) => { e.stopPropagation(); handleEdit(g); }}
                                                    className="gap-2 font-bold cursor-pointer rounded-xl py-3 focus:bg-primary/10"
                                                >
                                                    <Pencil className="h-4 w-4 text-blue-500" /> Edit Biodata Guru
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="gap-2 font-bold text-destructive cursor-pointer focus:bg-destructive/10 rounded-xl py-3"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteId(g.id_guru);
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" /> Hapus Pendidik
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <CardContent className="p-6 md:p-8">
                                        <div className="flex flex-col items-center text-center space-y-6">
                                            <div className="relative group/avatar">
                                                <Avatar className="h-20 w-20 md:h-28 md:w-28 border-4 border-background shadow-2xl ring-2 ring-primary/10 group-hover/avatar:ring-primary/30 transition-all duration-500">
                                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${g.nama}`} />
                                                    <AvatarFallback className="bg-primary/5 text-primary text-xl md:text-2xl font-black">
                                                        {g.nama.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-1 -right-1 h-6 w-6 md:h-8 md:w-8 bg-green-500 border-[3px] md:border-4 border-background rounded-full shadow-lg" />
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="font-black text-xl leading-tight tracking-tight group-hover:text-primary transition-colors">
                                                    {g.nama}
                                                </h3>
                                                <Badge variant="outline" className="font-black border-primary/10 text-primary bg-primary/5 px-4 py-1 rounded-xl text-[10px] uppercase tracking-widest">
                                                    NIP: {g.nip}
                                                </Badge>
                                            </div>

                                            <div className="w-full pt-6 space-y-3 border-t border-primary/5 text-left">
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground/80 font-bold bg-muted/30 p-2.5 rounded-xl border border-transparent hover:border-primary/10 transition-colors">
                                                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                                        <Mail className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span className="truncate">{g.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground/80 font-bold bg-muted/30 p-2.5 rounded-xl border border-transparent hover:border-primary/10 transition-colors">
                                                    <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500">
                                                        <BookOpen className="h-3.5 w-3.5" />
                                                    </div>
                                                    <span className="truncate">
                                                        {g.mapel_diampu?.length > 0
                                                            ? [...new Set(g.mapel_diampu.map((m: any) => m.mapel.nama_mapel))].join(", ")
                                                            : "Belum Mengampu Mapel"
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <Sheet open={isAddOpen || isEditOpen} onOpenChange={(open) => {
                    if (!open) {
                        setIsAddOpen(false);
                        setIsEditOpen(false);
                        setEditingGuru(null);
                        setFormData({
                            nip: "",
                            nama: "",
                            jenis_kelamin: "Laki-laki",
                            email: "",
                            no_hp: "",
                            id_kelas: null,
                            assignments: []
                        });
                    }
                }}>
                    <SheetContent className="w-full sm:max-w-xl bg-card/95 backdrop-blur-2xl border-l border-primary/10 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[100] overflow-y-auto p-0">
                        <div className="p-6 md:p-10 space-y-10">
                            <SheetHeader className="pb-8 border-b border-primary/5">
                                <div className="flex items-center gap-4 md:gap-6 pt-4">
                                    <div className="p-3 md:p-5 bg-primary/10 rounded-2xl md:rounded-[2rem] text-primary shadow-inner shrink-0">
                                        {isEditOpen ? <Pencil className="h-6 w-6 md:h-10 md:w-10" /> : <Plus className="h-6 w-6 md:h-10 md:w-10" />}
                                    </div>
                                    <div className="space-y-1 min-w-0">
                                        <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px] mb-2 px-3 py-1">
                                            Pendidik Management
                                        </Badge>
                                        <SheetTitle className="text-xl md:text-3xl font-black tracking-tighter uppercase truncate">{isEditOpen ? "Perbarui Data Guru" : "Daftarkan Guru"}</SheetTitle>
                                        <SheetDescription className="text-xs md:text-sm font-bold text-muted-foreground/80">
                                            {isEditOpen ? "Update informasi tenaga pendidik." : "Tambahkan tenaga pendidik baru."}
                                        </SheetDescription>
                                    </div>
                                </div>
                            </SheetHeader>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">NIP (Username)</label>
                                        <Input
                                            placeholder="Contoh: 1985..."
                                            value={formData.nip || ""}
                                            onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                                            className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-6"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nama Lengkap</label>
                                        <Input
                                            placeholder="Nama Guru"
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
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Alamat Email (Opsional)</label>
                                        <Input
                                            type="email"
                                            placeholder="email@sekolah.sch.id"
                                            value={formData.email || ""}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-6"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nomor HP</label>
                                        <Input
                                            placeholder="0812..."
                                            value={formData.no_hp || ""}
                                            onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                                            className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold px-6"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Wali Kelas (Opsional)</label>
                                        <select
                                            className="w-full h-14 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-bold px-6 appearance-none"
                                            value={formData.id_kelas || ""}
                                            onChange={(e) => setFormData({ ...formData, id_kelas: e.target.value ? parseInt(e.target.value) : null })}
                                        >
                                            <option value="">Bukan Wali Kelas</option>
                                            {kelas?.map((k: any) => (
                                                <option key={k.id_kelas} value={k.id_kelas}>{k.kelas} - {k.jurusan}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {!isEditOpen && (
                                        <div className="space-y-4 pt-4 border-t border-primary/5">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Mata Pelajaran Diampu</label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setFormData({
                                                        ...formData,
                                                        assignments: [...formData.assignments, { id_mapel: 0, id_kelas: 0 }]
                                                    })}
                                                    className="h-8 rounded-lg font-bold text-[10px]"
                                                >
                                                    <Plus className="h-3 w-3 mr-1" /> Tambah Baris
                                                </Button>
                                            </div>

                                            <div className="space-y-3">
                                                {formData.assignments.map((assign, idx) => (
                                                    <div key={idx} className="flex gap-2 items-center">
                                                        <select
                                                            className="flex-1 h-12 rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-bold px-4 text-xs appearance-none"
                                                            value={assign.id_mapel || ""}
                                                            onChange={(e) => {
                                                                const newAssignments = [...formData.assignments];
                                                                newAssignments[idx].id_mapel = parseInt(e.target.value);
                                                                setFormData({ ...formData, assignments: newAssignments });
                                                            }}
                                                        >
                                                            <option value="">Pilih Mapel</option>
                                                            {mapel?.map((m: any) => (
                                                                <option key={m.id_mapel} value={m.id_mapel}>{m.nama_mapel}</option>
                                                            ))}
                                                        </select>
                                                        <select
                                                            className="flex-1 h-12 rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-bold px-4 text-xs appearance-none"
                                                            value={assign.id_kelas || ""}
                                                            onChange={(e) => {
                                                                const newAssignments = [...formData.assignments];
                                                                newAssignments[idx].id_kelas = parseInt(e.target.value);
                                                                setFormData({ ...formData, assignments: newAssignments });
                                                            }}
                                                        >
                                                            <option value="">Pilih Kelas</option>
                                                            {kelas?.map((k: any) => (
                                                                <option key={k.id_kelas} value={k.id_kelas}>{k.kelas} {k.jurusan}</option>
                                                            ))}
                                                        </select>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-10 w-10 text-destructive rounded-xl"
                                                            onClick={() => {
                                                                const newAssignments = formData.assignments.filter((_, i) => i !== idx);
                                                                setFormData({ ...formData, assignments: newAssignments });
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                                {formData.assignments.length === 0 && (
                                                    <p className="text-[10px] text-center text-muted-foreground font-bold italic py-2">Belum ada mapel diampu yang ditambahkan.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-primary/5">
                                    <Button
                                        variant="outline"
                                        onClick={() => { setIsAddOpen(false); setIsEditOpen(false); }}
                                        className="flex-1 h-12 md:h-14 rounded-2xl font-black border-primary/10 hover:bg-muted order-2 sm:order-1"
                                    >
                                        Batalkan
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            if (isEditOpen) {
                                                updateMutation.mutate({
                                                    id: editingGuru.id_guru,
                                                    data: {
                                                        ...formData,
                                                        email: formData.email || null
                                                    }
                                                });
                                            } else {
                                                const validAssignments = formData.assignments.filter(a => a.id_mapel > 0 && a.id_kelas > 0);
                                                createMutation.mutate({
                                                    ...formData,
                                                    email: formData.email || null,
                                                    assignments: validAssignments
                                                });
                                            }
                                        }}
                                        disabled={createMutation.isPending || updateMutation.isPending || !formData.nip || !formData.nama}
                                        className="flex-1 h-12 md:h-14 rounded-2xl font-black shadow-xl shadow-primary/20 gap-2 order-1 sm:order-2"
                                    >
                                        {(createMutation.isPending || updateMutation.isPending) ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditOpen ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                        {isEditOpen ? "Perbarui" : "Simpan"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                <Sheet open={!!selectedGuru} onOpenChange={() => setSelectedGuru(null)}>
                    <SheetContent className="w-full sm:max-w-xl bg-card/95 backdrop-blur-2xl border-l border-primary/10 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[100] overflow-y-auto p-0">
                        <div className="p-6 md:p-10 space-y-10">
                            <SheetHeader className="pb-8 border-b border-primary/5">
                                <div className="flex items-center gap-4 md:gap-6 pt-4">
                                    <Avatar className="h-16 w-16 md:h-24 md:w-24 border-4 border-background shadow-2xl ring-2 ring-primary/20">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedGuru?.nama}`} />
                                        <AvatarFallback>{selectedGuru?.nama?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1 min-w-0">
                                        <Badge className="bg-primary/10 text-primary border-none font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px] mb-2 px-3 py-1">
                                            Pendidik Detail
                                        </Badge>
                                        <SheetTitle className="text-xl md:text-3xl font-black tracking-tighter uppercase truncate">{selectedGuru?.nama}</SheetTitle>
                                        <p className="text-xs md:text-sm font-bold text-primary flex items-center gap-2">
                                            NIP: {selectedGuru?.nip}
                                        </p>
                                    </div>
                                </div>
                            </SheetHeader>

                            <div className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 md:gap-y-10 gap-x-6">
                                    <DetailItem icon={Mail} label="Alamat Email" value={selectedGuru?.email} />
                                    <DetailItem icon={Phone} label="Nomor Telepon" value={selectedGuru?.no_hp} />
                                    <DetailItem icon={User} label="Jenis Kelamin" value={selectedGuru?.jenis_kelamin} />
                                    <DetailItem icon={BookOpen} label="Status Wali Kelas" value={selectedGuru?.id_kelas ? `Wali Kelas ${kelas?.find((k: any) => k.id_kelas === selectedGuru.id_kelas)?.kelas}` : "Tidak"} />
                                </div>

                                <div className="p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 space-y-6 shadow-inner">
                                    <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-primary/60 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        Jadwal Mengajar & Sesi
                                    </h4>
                                    <div className="space-y-4">
                                        {selectedGuru?.mapel_diampu?.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-3">
                                                {selectedGuru.mapel_diampu.map((m: any) => (
                                                    <div key={m.id_ampu} className="flex items-center justify-between p-4 rounded-2xl bg-background/50 border border-primary/5 hover:border-primary/20 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                                <BookOpen className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black tracking-tight">{m.mapel.nama_mapel}</p>
                                                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{m.mapel.kategori}</p>
                                                            </div>
                                                        </div>
                                                        <Badge className="bg-primary/10 text-primary border-none font-black text-[10px]">
                                                            {kelas?.find((k: any) => k.id_kelas === m.id_kelas)?.kelas}
                                                        </Badge>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="py-6 text-center">
                                                <p className="text-sm font-bold text-muted-foreground italic">Belum ada jadwal mengajar yang terdaftar.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-primary/5">
                                <Button
                                    onClick={() => handleEdit(selectedGuru)}
                                    className="flex-1 rounded-2xl font-black gap-2 h-12 md:h-14 shadow-xl shadow-primary/20 active:scale-95 transition-all"
                                >
                                    <Pencil className="h-4 w-4" /> Edit Guru
                                </Button>
                                <Button variant="outline" onClick={() => setSelectedGuru(null)} className="flex-1 rounded-2xl font-black border-primary/10 hover:bg-muted h-12 md:h-14 active:scale-95 transition-all">
                                    Tutup Detail
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
                    <AlertDialogContent className="rounded-[2rem] border-none shadow-2xl p-10">
                        <AlertDialogHeader className="space-y-4 text-center">
                            <div className="mx-auto p-4 rounded-full bg-destructive/10 text-destructive w-fit">
                                <Trash2 className="h-8 w-8" />
                            </div>
                            <AlertDialogTitle className="text-2xl font-black tracking-tight">Hapus Data Guru?</AlertDialogTitle>
                            <AlertDialogDescription className="text-lg font-medium">
                                Seluruh data guru ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
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
        <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
            </div>
            <p className="font-bold text-sm">{value || "-"}</p>
        </div>
    );
}

