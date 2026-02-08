"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Menu, User, Bell, LogOut, Moon, Sun, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({
    children,
    role
}: {
    children: React.ReactNode;
    role: "Admin" | "Guru" | "Siswa";
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();

    return (
        <div className="flex h-screen bg-background relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Mobile Sidebar */}
            <div className={cn(
                "fixed inset-0 z-40 lg:hidden transition-opacity duration-300",
                sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}>
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-72 bg-card border-r transition-transform duration-300 transform shadow-2xl",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <Sidebar role={role} onClose={() => setSidebarOpen(false)} />
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-72">
                <Sidebar role={role} />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
                {/* Header */}
                <header className="h-16 glass border-b flex items-center justify-between px-4 md:px-6 lg:px-8 z-30 sticky top-0 shrink-0">
                    <div className="flex items-center gap-2 md:gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        <h1 className="text-base font-bold md:text-xl truncate tracking-tight text-gradient">
                            {role} Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-1.5 md:gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-primary/10 transition-colors"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="h-5 w-5 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </Button>

                        <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors">
                            <Bell className="h-5 w-5" />
                        </Button>

                        <div className="h-6 w-[1px] bg-border mx-1 hidden md:block" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 md:h-12 md:w-auto md:px-3 rounded-full flex gap-3 items-center hover:bg-primary/5 group transition-all duration-300">
                                    <div className="h-7 w-7 md:h-9 md:w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary transition-colors">
                                        <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                                    </div>
                                    <div className="hidden md:flex flex-col items-start leading-tight">
                                        <span className="font-bold text-sm">{user?.username || "Admin"}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{role}</span>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 glass mt-1">
                                <DropdownMenuLabel className="font-bold">My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer focus:bg-primary/10" asChild>
                                    <Link href={`/${role.toLowerCase()}/profile`} className="flex items-center">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive cursor-pointer focus:bg-destructive/10" onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Body */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

