import { prisma } from "@/lib/prisma";

// Halaman Manajemen Pengguna di Admin Panel
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  
  // Memuat data dari database menggunakan Prisma ORM.
  // Model User dipanggil dan diurutkan berdasarkan tanggal terbaru.
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  }).catch((error: any) => {
    console.error("Gagal mendapatkan daftar pengguna dari database.", error);
    return [] as any[];
  });

  return (
    <div className="space-y-6">
      {/* Container untuk Judul Halaman */}
      <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1">
          Manajemen Pengguna
        </h2>
        <p className="text-neutral-400">
          Daftar seluruh akun yang terdaftar pada situs Web Dracin.
        </p>
      </div>

      {/* Tabel Data Pengguna (Users) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-neutral-800">
          <thead className="bg-neutral-950">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                ID / Nama
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Peran (Role)
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-neutral-900 divide-y divide-neutral-800 text-sm pb-8">
            {users.length === 0 ? (
              // Handling apabila koneksi database gagal atau tabel kosong.
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                  <p>Basis data tidak terhubung atau kosong. Data User tidak dapat dimuat.</p>
                </td>
              </tr>
            ) : (
              users.map((user: any) => (
                <tr key={user.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-medium text-neutral-200">{user.name || "Anonim"}</span>
                      {/* ID pengguna diperpendek untuk perapian design */}
                      <span className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded text-neutral-500 mt-1 max-w-[80px] break-all self-start">
                        {user.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-neutral-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Badge untuk role, dengan warna berbeda untuk admin vs user biasa */}
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        user.role === "ADMIN" 
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20" 
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {/* Aksi ini biasanya berupa Link ke Halaman Edit atau Tombol Submit untuk hapus */}
                    <button className="text-emerald-400 hover:text-emerald-300 mr-4 transition-colors">
                      Edit
                    </button>
                    <button className="text-red-400 hover:text-red-300 transition-colors opacity-80 hover:opacity-100">
                      Blokir
                    </button>
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
