'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, KeyRound, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Username dan password wajib diisi.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        router.push('/');
        router.refresh();
      } else {
        setErrorMessage(json.message || 'Login gagal. Periksa username dan password.');
      }
    } catch (err) {
      console.error('Login submit error:', err);
      setErrorMessage('Terjadi kesalahan koneksi. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-primary-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Kembali ke Portal Publik</span>
          </Link>
        </div>

        {/* Form Container Card */}
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-primary-600/20 text-primary-400 flex items-center justify-center mx-auto border border-primary-500/30">
              <Lock size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-heading text-white">
                CMS Admin Desa
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Masuk ke panel pengelolaan Desa Sukabanjar
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <User size={14} className="text-primary-400" />
                Username Admin
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username..."
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <KeyRound size={14} className="text-primary-400" />
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all placeholder:text-slate-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-500 disabled:bg-slate-700 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <span>Masuk ke Dashboard</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
