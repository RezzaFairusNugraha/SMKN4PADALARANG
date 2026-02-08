"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import PublicNavbar from "@/components/public/navbar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    BookOpen,
    Users,
    Trophy,
    ArrowRight,
    Sparkles,
    School,
    Globe,
    MessageCircle,
    CheckCircle2,
    Calendar,
    Star,
    GraduationCap,
    ExternalLink,
    Newspaper,
    User
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// BeritaSection Component
function BeritaSection() {
    const { data: berita, isLoading } = useQuery({
        queryKey: ["public-berita"],
        queryFn: async () => {
            const response = await axios.get("http://localhost:8000/api/berita/public");
            return response.data;
        }
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-96 rounded-[2.5rem] bg-muted animate-pulse" />
                ))}
            </div>
        );
    }

    if (!berita || berita.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center rounded-[3rem] border-2 border-dashed border-border/50 bg-card/20 backdrop-blur-sm">
                <div className="p-6 rounded-full bg-background border border-border mb-6">
                    <Newspaper className="h-12 w-12 text-muted-foreground/30" />
                </div>
                <p className="text-muted-foreground font-black text-xl tracking-tight">Belum Ada Informasi Publik</p>
                <p className="text-muted-foreground/60 font-medium max-w-[300px] mt-2 italic text-sm">Kembali lagi nanti untuk mendapatkan kabar terbaru dari kami.</p>
            </div>
        );
    }

    return (
        <div className="space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {berita.map((item: any, idx: number) => (
                    <motion.div
                        key={item.id_berita}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Link href={`/berita/${item.id_berita}`}>
                            <Card className="h-full border border-border/50 shadow-xl shadow-primary/5 bg-card/40 backdrop-blur-md overflow-hidden group hover:border-primary/50 transition-all duration-500 rounded-[2.5rem] flex flex-col">
                                <div className="p-0 h-48 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative overflow-hidden flex items-center justify-center shrink-0">
                                    {item.gambar ? (
                                        <img
                                            src={`http://localhost:8000/api/uploads/${item.gambar}`}
                                            alt={item.judul}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <Newspaper className="h-20 w-20 text-primary/10 group-hover:scale-125 transition-transform duration-700" />
                                    )}
                                    <div className="absolute top-6 left-6">
                                        <span className="px-3 py-1 rounded-full bg-primary text-white text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                            Berita Terkini
                                        </span>
                                    </div>
                                </div>
                                <CardContent className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                <Calendar className="h-3 w-3 text-primary" />
                                                {format(new Date(item.tanggal_post), "dd MMM yyyy", { locale: id })}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase">
                                                <User className="h-3 w-3" />
                                                {item.nama_penulis}
                                            </div>
                                        </div>
                                        <h3 className="font-black text-2xl leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                            {item.judul}
                                        </h3>
                                        <p className="text-muted-foreground font-medium line-clamp-3 text-sm leading-relaxed capitalize">
                                            {item.isi}
                                        </p>
                                    </div>
                                    <div className="pt-6 border-t border-border/50">
                                        <span className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                            Baca Selengkapnya
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="text-center"
            >
                <Link href="/berita">
                    <Button variant="outline" size="lg" className="rounded-2xl px-12 h-16 font-black border-border/50 hover:bg-primary/5 hover:text-primary transition-all gap-3 uppercase tracking-widest text-[10px]">
                        Lihat Semua Berita
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
            <PublicNavbar />

            {/* Hero Section */}
            <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />

                <div className="container mx-auto px-6">
                    <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">


                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]"
                        >
                            Membangun Karakter <span className="text-primary">Cerdas</span> & <span className="text-primary italic">Berprestasi</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-muted-foreground font-medium max-w-2xl"
                        >
                            SMKN 4 Padalarang berkomitmen menghasilkan SDM yang unggul dan berkarakter melalui pendidikan vokasi yang modern dan relevan dengan industri.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Button size="lg" className="rounded-full font-black px-8 h-14 text-base shadow-xl shadow-primary/20 gap-2 group">
                                Jelajahi Program
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button size="lg" variant="outline" className="rounded-full font-black px-8 h-14 text-base gap-2">
                                <a href="https://api.whatsapp.com/send/?phone=6285863244821&text&type=phone_number&app_absent=0">Hubungi Kami</a>
                                <MessageCircle className="h-5 w-5" />
                            </Button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 mt-16"
                        >
                            {[
                                { label: "Siswa Aktif", value: "1,666+" },
                                { label: "Rombel/Kelas", value: "49+" },
                                { label: "Kompetensi Keahlian", value: "7" },
                                { label: "Tahun Berdiri", value: "1970" },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <span className="text-3xl font-black text-primary">{stat.value}</span>
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Majors Section */}
            <section id="jurusan" className="py-24 bg-background">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-black tracking-tight mb-4">Kompetensi Keahlian</h2>
                        <p className="text-muted-foreground font-medium">
                            Pilih program keahlian yang sesuai dengan minat dan bakatmu untuk masa depan yang gemilang.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "Rekayasa Perangkat Lunak", code: "RPL", desc: "Mempelajari pengembangan aplikasi, web, dan solusi perangkat lunak." },
                            { title: "Teknik Komputer & Jaringan", code: "TKJ", desc: "Fokus pada infrastruktur jaringan, hardware, dan administrasi server." },
                            { title: "Kimia Industri", code: "KI", desc: "Mempelajari proses kimia dalam skala industri dan laboratorium." },
                            { title: "Teknik Elektronika Industri", code: "TEIN", desc: "Otomasi industri, sistem kontrol, dan perangkat elektronika cerdas." },
                            { title: "Agribisnis Tanaman Pangan & Hortikultura", code: "ATPH", desc: "Pengembangan bibit unggul, kultur jaringan, dan pertanian modern." },
                            { title: "Bisnis Daring & Pemasaran", code: "BDP", desc: "Strategi pemasaran digital, e-commerce, dan kewirausahaan modern." },
                        ].map((major, i) => (
                            <div key={i} className="p-6 rounded-3xl bg-card border border-primary/5 hover:border-primary/20 hover:shadow-xl transition-all group">
                                <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-2xl mb-4 font-black group-hover:scale-110 transition-transform">
                                    {major.code}
                                </div>
                                <h3 className="text-xl font-black mb-2">{major.title}</h3>
                                <p className="text-sm text-muted-foreground font-medium">{major.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Vision & Mission Section */}
            <section className="py-24 bg-primary/5 border-y border-primary/10" id="visi">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-black tracking-tight mb-6">Visi Sekolah</h2>
                            <blockquote className="border-l-4 border-primary pl-6 py-2 italic text-2xl font-medium text-foreground">
                                "Menjadi Sekolah Menengah Kejuruan yang menghasilkan Sumber Daya Manusia Unggul, Kreatif, Inovatif, dan Kompetitif yang Berlandaskan Iman dan Taqwa."
                            </blockquote>
                        </div>
                        <div className="space-y-6">
                            <h2 className="text-4xl font-black tracking-tight mb-6">Misi Sekolah</h2>
                            <ul className="space-y-4">
                                {[
                                    "Menyelenggarakan pendidikan vokasi yang berkualitas dan relevan dengan kebutuhan DUDI.",
                                    "Membentuk karakter siswa yang disiplin, mandiri, dan berakhlak mulia.",
                                    "Mengembangkan budaya inovasi dan kewirausahaan di lingkungan sekolah.",
                                    "Meningkatkan kualitas SDM pendidik dan tenaga kependidikan."
                                ].map((misi, i) => (
                                    <li key={i} className="flex gap-4 items-start">
                                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-black shrink-0 mt-1">{i + 1}</div>
                                        <span className="font-medium text-muted-foreground">{misi}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className="py-24 container mx-auto px-6">
                <div className="bg-primary rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl shadow-primary/20">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />

                    <div className="relative z-10 flex flex-col items-center text-center gap-8">
                        <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                            Siap Untuk <span className="italic text-secondary">Bergabung</span> Bersama Kami?
                        </h2>
                        <p className="text-primary-foreground/80 font-medium max-w-xl">
                            Penerimaan Siswa Baru (PPDB) tahun ajaran 2025/2026 telah dibuka. Pastikan kamu menjadi bagian dari agen perubahan masa depan.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <Button size="lg" asChild className="bg-white text-primary hover:bg-primary hover:text-primary-foreground rounded-full font-black px-10 h-16 text-lg transition-all duration-300">
                                <Link href="/register">Daftar Sekarang</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="border-white/20 text-foreground hover:bg-white/10 rounded-full font-black px-10 h-16 text-lg" asChild>
                                <a href="https://jadwal.smkn4padalarang.sch.id/" target="_blank" rel="noopener noreferrer">
                                    Jadwal Pelajaran
                                    <ExternalLink className="ml-2 h-5 w-5" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-primary/5 bg-card/30">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-2 space-y-6">
                            <div className="flex items-center gap-3">
                                <Image src="/logo.png" alt="Logo SMKN 4" width={48} height={48} />
                                <div className="flex flex-col">
                                    <span className="text-xl font-black tracking-tighter">SMKN 4 PADALARANG</span>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Kreatif, Inovatif, Kompetitif</span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground font-medium max-w-sm leading-relaxed">
                                Sekolah Menengah Kejuruan Negeri 4 Padalarang adalah institusi pendidikan vokasi unggulan di Kabupaten Bandung Barat.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-black text-sm uppercase tracking-widest">Layanan</h4>
                            <ul className="space-y-2 text-sm font-bold text-muted-foreground">
                                <li><a href="https://jadwal.smkn4padalarang.sch.id/" className="hover:text-primary transition-colors">Jadwal Pelajaran</a></li>
                                <li><a href="https://bkk.smkn4padalarang.sch.id/" className="hover:text-primary transition-colors">BKK SMKN 4</a></li>
                                <li><a href="https://lms.smkn4padalarang.sch.id/" className="hover:text-primary transition-colors">E-Learning (LMS)</a></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-black text-sm uppercase tracking-widest">Bantuan</h4>
                            <ul className="space-y-2 text-sm font-bold text-muted-foreground">
                                <li><Link href="/#contact" className="hover:text-primary transition-colors">Hubungi Kami</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Pertanyaan Umum</Link></li>
                                <li><Link href="#" className="hover:text-primary transition-colors">Alumni</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs font-bold text-muted-foreground font-mono italic">
                            &copy; 2025 SMKN 4 PADALARANG.
                        </p>
                        <div className="flex gap-6 text-xs font-bold text-muted-foreground">
                            <Link href="#" className="hover:text-primary transition-colors uppercase">Kebijakan Privasi</Link>
                            <Link href="#" className="hover:text-primary transition-colors uppercase">Syarat & Ketentuan</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
