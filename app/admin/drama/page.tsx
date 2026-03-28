import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";

// Server Component (RSC) Next.js untuk melihat daftar drama pada Admin Panel.
export const dynamic = "force-dynamic";

export default async function AdminDramaPage() {
  
  // Mengambil data drama beserta informasi berapa banyak episodenya.
  // Gunakan block try-catch jika server belum terkoneksi database dengan baik.
  // Saat ini dibiarkan memanggil secara langsung karena Prisma sudah terintegrasi.
  const dramas = await prisma.drama.findMany({
    include: {
      _count: {
        select: { episodes: true },
      },
    },
    orderBy: { createdAt: "desc" },
  }).catch((error: any) => {
    console.error("Database gagal dihubungkan, menampilkan array kosong.", error);
    return [] as any[];
  });

  return (
    <div className="space-y-6">
      {/* Header Halaman Drama */}
      <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
            Manajemen Drama
          </h2>
          <p className="text-neutral-400">
            Daftar seluruh judul drama China yang tersedia di aplikasi.
          </p>
        </div>
        <Link 
          href="/admin/drama/create" 
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={20} /> Tambah Drama
        </Link>
      </div>

      {/* Tabel Data Drama */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-neutral-800">
          <thead className="bg-neutral-950">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Judul & Status
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Tahun Rilis
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Jumlah Episode
              </th>
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-neutral-900 divide-y divide-neutral-800 text-sm">
            {dramas.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                  <p>Data belum tersedia. Silahkan jalankan sinkronisasi / migrasi Prisma.</p>
                </td>
              </tr>
            ) : (
              dramas.map((drama: any) => (
                <tr key={drama.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-neutral-200">{drama.title}</div>
                    <div className="text-xs text-neutral-500 mt-1">{drama.status || "Ongoing"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-neutral-400">
                    {drama.releaseYear || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-neutral-400">
                    <span className="bg-neutral-800 px-2 py-1 rounded-md text-xs border border-neutral-700">
                      {drama._count.episodes} Ep
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                    <button className="text-blue-400 hover:text-blue-300 mr-4">Edit</button>
                    <button className="text-red-400 hover:text-red-300">Hapus</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
