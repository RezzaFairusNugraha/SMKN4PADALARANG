"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import {
    Calendar,
    User,
    ChevronLeft,
    Clock,
    Share2,
    Bookmark,
    Newspaper,
    Loader2,
    ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function PublicBeritaDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const { data: news, isLoading, error } = useQuery({
        queryKey: ["public-berita-detail", id],
        queryFn: async () => {
            const response = await apiClient.get(`/api/berita/public/${id}`);
            return response.data;
        }
    });

    const { data: otherNews } = useQuery({
        queryKey: ["public-berita-recent"],
        queryFn: async () => {
            const response = await apiClient.get("/api/berita/public");
            return response.data;
        }
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Menuangkang informasi...</p>
            </div>
        );
    }

    if (error || !news) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-background p-6">
                <div className="p-8 rounded-full bg-destructive/10 border border-destructive/20 relative">
                    <Newspaper className="h-16 w-16 text-destructive" />
                    <div className="absolute -top-2 -right-2 px-3 py-1 bg-destructive text-white text-[10px] font-black rounded-full uppercase">Error</div>
                </div>
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-black tracking-tighter">Berita Tidak Ditemukan</h1>
                    <p className="text-muted-foreground max-w-md mx-auto font-medium">
                        Maaf, kabar yang kamu cari mungkin telah dihapus atau tautan yang kamu ikuti tidak valid.
                    </p>
                </div>
                <Link href="/berita">
                    <Button variant="outline" size="lg" className="rounded-2xl font-black px-10 h-16 border-border/50 hover:bg-muted transition-all gap-3">
                        <ChevronLeft className="h-5 w-5" />
                        Kembali ke Warta
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Content starts below PublicNavbar */}

            <main className="pt-24 pb-32">
                <div className="max-w-4xl mx-auto px-6 space-y-12">
                    {/* Header Metadata */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">Informasi</span>
                            <span className="text-muted-foreground/30">•</span>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" />
                                3 MIN READ
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-foreground">
                            {news.judul}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/50">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary-foreground flex items-center justify-center text-white shadow-xl shadow-primary/20">
                                    <User className="h-6 w-6" />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-sm font-black uppercase tracking-wider">{news.nama_penulis}</p>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{news.role_penulis} • EDUKATIF</p>
                                </div>
                            </div>
                            <div className="h-10 w-px bg-border/50 hidden sm:block" />
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Calendar className="h-5 w-5 text-primary" />
                                <span className="text-sm font-black uppercase tracking-widest">
                                    {format(new Date(news.tanggal_post), "dd MMMM yyyy", { locale: localeId })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {news.gambar && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl shadow-primary/10 border border-border/40"
                        >
                            <img
                                src={`http://localhost:8000/api/uploads/${news.gambar}`}
                                alt={news.judul}
                                className="w-full h-full object-cover transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                        </motion.div>
                    )}

                    {/* Content */}
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <div className="text-xl md:text-2xl leading-relaxed font-medium text-foreground/80 whitespace-pre-wrap selection:bg-primary/20 select-none">
                            {news.isi}
                        </div>
                    </div>

                    {/* Footer Nav */}
                    <div className="pt-16 mt-20 border-t-2 border-border/50 flex flex-col md:flex-row gap-12 justify-between">
                        <div className="space-y-6 max-w-sm">
                            <h4 className="text-2xl font-black uppercase tracking-tighter">Tetap Terhubung</h4>
                            <p className="text-muted-foreground font-medium text-sm">
                                Dapatkan berita dan pengumuman terbaru langsung dari warga sekolah melalui portal informasi resmi kami.
                            </p>
                            <Link href="/berita">
                                <Button variant="link" className="p-0 h-auto text-primary font-black uppercase tracking-widest text-xs gap-2 hover:gap-3 transition-all">
                                    Lihat Semua Berita <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        {/* More News Sidebar Suggestion */}
                        <div className="space-y-6 flex-1 max-w-md">
                            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Berita Terbaru Lainnya</h4>
                            <div className="space-y-4">
                                {otherNews?.filter((n: any) => n.id_berita !== Number(id)).slice(0, 3).map((n: any) => (
                                    <Link key={n.id_berita} href={`/berita/${n.id_berita}`}>
                                        <Card className="group p-4 bg-card/40 hover:bg-primary/5 border-border/40 hover:border-primary/30 transition-all rounded-2xl cursor-pointer">
                                            <div className="flex gap-4 items-center">
                                                <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-muted">
                                                    {n.gambar ? (
                                                        <img src={`http://localhost:8000/api/uploads/${n.gambar}`} className="w-full h-full object-cover" />
                                                    ) : <Newspaper className="h-full w-full p-4 text-muted-foreground/20" />}
                                                </div>
                                                <div className="space-y-1">
                                                    <h5 className="font-black text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors">{n.judul}</h5>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                                        {format(new Date(n.tanggal_post), "dd MMM yyyy", { locale: localeId })}
                                                    </p>
                                                </div>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
