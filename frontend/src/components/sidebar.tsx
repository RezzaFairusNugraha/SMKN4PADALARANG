"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  BookOpen,
  GraduationCap,
  Clock,
  Newspaper,
  Settings,
  X
} from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";

interface SidebarProps {
  role: "Admin" | "Guru" | "Siswa";
  onClose?: () => void;
}

const menuItems = {
  Admin: [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Data Siswa", href: "/admin/siswa", icon: Users },
    { name: "Data Guru", href: "/admin/guru", icon: UserSquare2 },
    { name: "Mata Pelajaran", href: "/admin/mapel", icon: BookOpen },
    { name: "Data Pengampu", href: "/admin/pengampu", icon: Users },
    { name: "Data Kelas", href: "/admin/kelas", icon: GraduationCap },
    { name: "Berita", href: "/admin/berita", icon: Newspaper },
  ],
  Guru: [
    { name: "Dashboard", href: "/guru", icon: LayoutDashboard },
    { name: "Input Nilai", href: "/guru/nilai", icon: BookOpen },
    { name: "Berita", href: "/guru/berita", icon: Newspaper },
  ],
  Siswa: [
    { name: "Dashboard", href: "/siswa", icon: LayoutDashboard },
    { name: "Lihat Nilai", href: "/siswa/nilai", icon: BookOpen },
    { name: "Berita", href: "/siswa/berita", icon: Newspaper },
  ]
};

export function Sidebar({ role, onClose }: SidebarProps) {
  const pathname = usePathname();
  const items = menuItems[role] || [];

  return (
    <div className="flex flex-col h-full bg-card/50 backdrop-blur-xl border-r border-primary/5">
      <div className="p-6 md:p-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-transparent group-hover:rotate-12 transition-transform duration-300 flex-shrink-0">
            <Image src="/logo.png" alt="Logo SMKN 4" width={32} height={32} className="object-contain md:w-10 md:h-10" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-black text-lg md:text-xl leading-none tracking-tighter text-gradient uppercase truncate">SMKN 4</span>
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold leading-none mt-1 truncate">Padalarang</span>
          </div>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden hover:bg-primary/10 transition-colors">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="px-4 py-2">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-4 mb-4">Main Menu</p>
        <nav className="space-y-1.5 overflow-y-auto pb-4">
          {items.map((item) => {
            const isActive = item.href === "/admin" || item.href === "/guru" || item.href === "/siswa"
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                )}
                onClick={onClose}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                )}
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive ? "text-primary scale-110" : "group-hover:text-primary group-hover:scale-110"
                )} />
                {item.name}
                <div className={cn(
                  "absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                  isActive && "opacity-0"
                )} />
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-primary/10 relative overflow-hidden group">
          <div className="relative z-10 text-xs font-bold text-center">
            <p className="text-foreground/70 mb-2 font-black uppercase tracking-wider">Butuh Bantuan?</p>
            <Button size="sm" variant="outline" className="w-full bg-white/50 dark:bg-black/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-lg">
              <a href="https://wa.me/6285863244821">Hubungi Support</a>
            </Button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-primary/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500" />
        </div>
      </div>
    </div>
  );
}
