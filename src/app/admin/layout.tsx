'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setIsAdmin } = useAdmin();

  const isLoginPage = pathname === '/admin/login';
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(isLoginPage ? true : null);

  useEffect(() => {
    if (isLoginPage) return;

    let isMounted = true;

    async function verifyAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated) {
            if (isMounted) {
              setIsAdmin(true);
              setIsAuthenticated(true);
            }
            return;
          }
        }
        
        // Not authenticated
        if (isMounted) {
          setIsAdmin(false);
          setIsAuthenticated(false);
          router.replace('/admin/login');
        }
      } catch (err) {
        if (isMounted) {
          setIsAdmin(false);
          setIsAuthenticated(false);
          router.replace('/admin/login');
        }
      }
    }

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, isLoginPage, router, setIsAdmin]);

  // Jika di halaman /admin/login, langsung render children
  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-950">{children}</div>;
  }

  // Jika sedang memverifikasi autentikasi di rute admin
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3">
        <Loader2 size={32} className="animate-spin text-primary-500" />
        <p className="text-xs font-medium tracking-wide">Memverifikasi Hak Akses Admin...</p>
      </div>
    );
  }

  // Jika tidak terautentikasi (sedang di-redirect ke /admin/login)
  if (!isAuthenticated) {
    return null;
  }

  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
