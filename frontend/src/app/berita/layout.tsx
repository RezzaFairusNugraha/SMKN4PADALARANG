"use client";

import PublicNavbar from "@/components/public/navbar";

export default function BeritaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background">
            <PublicNavbar />
            {children}
        </div>
    );
}
