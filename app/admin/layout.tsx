import Link from "next/link";
import { LayoutDashboard, Film, Users } from "lucide-react";

// File layout.tsx ini mengontrol kerangka UI (Sidebar/Navbar) untuk keseluruhan area Admin.
// Semua halaman di dalam folder '/admin' akan dibungkus oleh layout ini.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Sidebar untuk navigasi cepat antar halaman admin */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900 flex-shrink-0">
        <div className="p-6">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Admin Panel
          </h2>
          <p className="text-sm text-neutral-400 mt-1">Web Dracin Dashboard</p>
        </div>
        
        {/* Menu navigasi admin */}
        <nav className="mt-6 px-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link
            href="/admin/drama"
            className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Film size={20} />
            Kelola Drama
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Users size={20} />
            Pengguna
          </Link>
        </nav>
      </aside>

      {/* Konten utama yang berubah sesuai dengan rute (halaman page.tsx yang aktif) */}
      <main className="flex-1 overflow-y-auto">
        {/* Area Header */}
        <header className="h-16 border-b border-neutral-800 flex items-center px-8 bg-neutral-950/50 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-lg font-medium text-neutral-200">
            Sistem Manajemen Konten
          </h1>
          <div className="ml-auto">
            {/* Navigasi kembali ke website utama */}
            <Link 
              href="/" 
              className="text-sm px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
            >
              Kembali ke Web
            </Link>
          </div>
        </header>

        {/* Konten halaman anak (children) dirender di sini */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
