export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <div className="max-w-3xl space-y-6">
        <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
          Website Profil & Portal Digital
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
          Selamat Datang di Desa Sukabanjar
        </h1>
        <p className="text-slate-400 text-lg md:text-xl">
          Kecamatan Sidomulyo, Kabupaten Lampung Selatan, Lampung.
        </p>
      </div>
    </main>
  );
}
