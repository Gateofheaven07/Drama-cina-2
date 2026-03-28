import { Navbar } from '@/components/Navbar';

export default function CategoriesPage() {
  return (
    <>
      <Navbar />
      <main className="px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-foreground mb-4">
          Kategori Drama
        </h1>
        <p className="text-muted-foreground max-w-lg mb-8 text-lg">
          Eksplorasi berbagai genre dan kategori drama pilihan kami. Halaman ini sedang dalam tahap pengembangan dan akan segera hadir.
        </p>
        <div className="flex gap-4">
          <div className="w-24 h-2 bg-accent rounded-full animate-pulse" />
          <div className="w-12 h-2 bg-accent/50 rounded-full animate-pulse delay-75" />
          <div className="w-24 h-2 bg-accent rounded-full animate-pulse delay-150" />
        </div>
      </main>
    </>
  );
}
