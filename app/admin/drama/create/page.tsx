import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Halaman form untuk menambahkan data drama secara manual melalui Admin Panel
export default function CreateDramaPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Bagian header untuk form tambah drama */}
      <div className="flex items-center gap-4">
        {/* Tombol kembali ke list drama */}
        <Link 
          href="/admin/drama" 
          className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-colors text-neutral-400"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Tambah Drama Baru
          </h2>
          <p className="text-neutral-400 text-sm mt-1">
            Silahkan isi form di bawah ini untuk menambahkan serial drama China terbaru ke basis data.
          </p>
        </div>
      </div>

      {/* Form Input Detail Drama */}
      <div className="bg-neutral-900 border border-neutral-800 p-8 rounded-xl shadow-sm">
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">
              Judul Drama
            </label>
            <input 
              type="text" 
              placeholder="Contoh: The Untamed" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-neutral-200 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Tahun Rilis
              </label>
              <input 
                type="number" 
                placeholder="Contoh: 2024" 
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-neutral-200 outline-none focus:border-emerald-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300">
                Status
              </label>
              <select className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-neutral-200 outline-none focus:border-emerald-500 transition-all">
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
                <option value="Coming Soon">Coming Soon</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">
              Sinopsis (Deskripsi Singkat)
            </label>
            <textarea 
              rows={4}
              placeholder="Masukkan plot singkat drama ini..." 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-neutral-200 outline-none focus:border-emerald-500 transition-all resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-300">
              URL Cover Image
            </label>
            <input 
              type="text" 
              placeholder="https://.../gambar-cover.jpg" 
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-neutral-200 outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Tombol Simpan */}
          <div className="pt-4 border-t border-neutral-800 flex justify-end">
            <button 
              type="button"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-sm"
            >
              Simpan Data Drama
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
