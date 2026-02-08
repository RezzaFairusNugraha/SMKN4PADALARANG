"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { GraduationCap, LayoutDashboard, LogIn, Menu, X, ExternalLink, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export default function PublicNavbar() {
    const { user } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Beranda", href: "/" },
        { name: "Jurusan", href: "/#jurusan" },
        { name: "Visi Dan Misi", href: "/#visi" },
        {
            name: "Layanan",
            href: "#",
            sublinks: [
                { name: "Jadwal Pelajaran", href: "https://jadwal.smkn4padalarang.sch.id/", icon: ExternalLink },
                { name: "BKK SMKN 4", href: "https://bkk.smkn4padalarang.sch.id/", icon: ExternalLink },
                { name: "LMS", href: "https://lms.smkn4padalarang.sch.id/", icon: ExternalLink },
            ]
        },
        { name: "Berita", href: "/berita" },
        { name: "Kontak", href: "/#kontak" },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
                isScrolled
                    ? "bg-background/80 backdrop-blur-md border-primary/10 py-3 shadow-lg"
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="container mx-auto px-6 h-full flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-transparent group-hover:rotate-12 transition-transform duration-300">
                        <Image src="/logo.png" alt="Logo SMKN 4" width={40} height={40} className="object-contain" />
                    </div>
                    <span className="text-xl font-black tracking-tighter">SMKN 4 PADALARANG</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        link.sublinks ? (
                            <div key={link.name} className="relative group/menu">
                                <button className="flex items-center gap-1 text-sm font-bold text-foreground/70 hover:text-primary transition-colors py-2">
                                    {link.name}
                                    <ChevronDown className="h-4 w-4 transition-transform group-hover/menu:rotate-180" />
                                </button>
                                <div className="absolute top-full left-0 mt-1 w-48 bg-background border border-primary/10 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-300 transform translate-y-2 group-hover/menu:translate-y-0">
                                    {link.sublinks.map((sub) => (
                                        <a
                                            key={sub.name}
                                            href={sub.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between px-4 py-2 text-xs font-bold text-foreground/70 hover:bg-primary/5 hover:text-primary transition-colors"
                                        >
                                            {sub.name}
                                            <sub.icon className="h-3 w-3" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold text-foreground/70 hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        )
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:block">
                        <ThemeToggle />
                    </div>
                    {user ? (
                        <Button asChild className="rounded-full font-bold px-6 shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90">
                            <Link href={user.role === "Admin" ? "/admin" : user.role === "Guru" ? "/guru" : "/siswa"}>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                        </Button>
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Button variant="ghost" asChild className="rounded-full font-bold">
                                <Link href="/register">Daftar</Link>
                            </Button>
                            <Button asChild className="rounded-full font-bold px-6 shadow-lg shadow-primary/20">
                                <Link href="/login">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login
                                </Link>
                            </Button>
                        </div>
                    )}

                    <button
                        className="md:hidden p-2 rounded-lg bg-primary/5 text-primary"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b border-primary/5 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Menu</span>
                                <ThemeToggle />
                            </div>
                            {navLinks.map((link) => (
                                <div key={link.name}>
                                    {link.sublinks ? (
                                        <div className="space-y-2">
                                            <span className="text-lg font-bold text-primary">{link.name}</span>
                                            <div className="pl-4 flex flex-col gap-2 border-l-2 border-primary/10">
                                                {link.sublinks.map((sub) => (
                                                    <a
                                                        key={sub.name}
                                                        href={sub.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-base font-medium flex items-center justify-between"
                                                    >
                                                        {sub.name}
                                                        <ExternalLink className="h-4 w-4 opacity-50" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="text-lg font-bold"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </div>
                            ))}
                            <hr className="border-primary/5" />
                            {!user && (
                                <div className="flex flex-col gap-2">
                                    <Button variant="outline" asChild className="rounded-xl font-bold w-full">
                                        <Link href="/register">Daftar</Link>
                                    </Button>
                                    <Button asChild className="rounded-xl font-bold w-full">
                                        <Link href="/login">Login</Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
