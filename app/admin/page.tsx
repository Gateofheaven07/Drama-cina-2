import { Film, Users, PlayCircle, Star } from "lucide-react";

// Halaman utama Dashboard (/admin) untuk memberikan ringkasan statistik
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
          Dashboard Ikhtisar
        </h2>
        <p className="text-neutral-400">
          Selamat datang kembali! Berikut ringkasan aplikasi web Dracin Anda.
        </p>
      </div>

      {/* Grid untuk menampilkan kartu-kartu statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Drama"
          value="124"
          icon={<Film size={24} className="text-emerald-500" />}
          description="+12 minggu ini"
        />
        <StatCard
          title="Total Episode"
          value="2,481"
          icon={<PlayCircle size={24} className="text-blue-500" />}
          description="+40 minggu ini"
        />
        <StatCard
          title="Pengguna Aktif"
          value="4,231"
          icon={<Users size={24} className="text-purple-500" />}
          description="+180 sejak bulan lalu"
        />
        <StatCard
          title="Total Bookmark"
          value="12,890"
          icon={<Star size={24} className="text-amber-500" />}
          description="Paling banyak pada hari Sabtu"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Aktivitas Terkini (Placeholder) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Aktivitas Terkini
          </h3>
          <ul className="space-y-4 text-neutral-300">
            <li className="flex justify-between pb-3 border-b border-neutral-800">
              <span>Admin menambahkan episode baru "Nirvana in Fire Ep 4"</span>
              <span className="text-xs text-neutral-500">2 jam yang lalu</span>
            </li>
            <li className="flex justify-between pb-3 border-b border-neutral-800">
              <span>Drama baru "The Untamed" berhasil dibuat</span>
              <span className="text-xs text-neutral-500">5 jam yang lalu</span>
            </li>
            <li className="flex justify-between pb-3 border-b border-neutral-800">
              <span>User @budi baru saja mendaftar</span>
              <span className="text-xs text-neutral-500">1 hari yang lalu</span>
            </li>
          </ul>
        </div>
        
        {/* Tugas Cepat (Quick Actions) */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Tugas Cepat
          </h3>
          <div className="flex flex-col gap-3">
            <button className="text-left w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-emerald-400 font-medium transition-colors">
              + Tambah Drama Baru
            </button>
            <button className="text-left w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-blue-400 font-medium transition-colors">
              + Unggah Episode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Komponen Card kecil untuk statistik, bisa digunakan berulang kali
function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-700 transition-colors shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-neutral-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        </div>
        <div className="p-3 bg-neutral-950 rounded-lg">{icon}</div>
      </div>
      <p className="text-xs text-neutral-500">{description}</p>
    </div>
  );
}
