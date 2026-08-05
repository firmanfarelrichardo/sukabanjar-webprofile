'use client';

import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdmin } from '@/context/AdminContext';

const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 Menit (300.000 ms)

export default function AdminIdleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAdmin, setIsAdmin, setIsEditMode } = useAdmin();

  const isLoginPage = pathname === '/admin/login';
  const lastActivityRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLoggingOutRef = useRef<boolean>(false);

  useEffect(() => {
    // Idle guard hanya aktif untuk sesi admin yang terautentikasi dan bukan di rute login
    if (isLoginPage || !isAdmin) return;

    const performAutoLogout = async () => {
      if (isLoggingOutRef.current) return;
      isLoggingOutRef.current = true;

      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (err) {
        console.error('Auto logout error:', err);
      } finally {
        setIsAdmin(false);
        setIsEditMode(false);
        router.push('/admin/login?reason=inactivity');
        router.refresh();
      }
    };

    const startTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);

      const elapsed = Date.now() - lastActivityRef.current;
      const remaining = IDLE_TIMEOUT_MS - elapsed;

      if (remaining <= 0) {
        performAutoLogout();
      } else {
        timerRef.current = setTimeout(performAutoLogout, remaining);
      }
    };

    let lastThrottle = 0;
    const handleUserActivity = () => {
      const now = Date.now();
      // Throttle pembaruan lastActivity setiap 1 detik agar performa tetap responsif
      if (now - lastThrottle > 1000) {
        lastThrottle = now;
        lastActivityRef.current = now;
        startTimer();
      }
    };

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        const elapsed = Date.now() - lastActivityRef.current;
        if (elapsed >= IDLE_TIMEOUT_MS) {
          performAutoLogout();
        } else {
          startTimer();
        }
      }
    };

    // Set timer awal
    lastActivityRef.current = Date.now();
    startTimer();

    // Event listener untuk mendeteksi berbagai jenis aktivitas admin
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity, { passive: true });
    });

    // Event listener untuk deteksi saat admin kembali ke tab (visibility / focus)
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [isAdmin, isLoginPage, router, setIsAdmin, setIsEditMode]);

  return <>{children}</>;
}
