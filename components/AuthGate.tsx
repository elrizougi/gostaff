 'use client';
 
 import React, { useEffect } from 'react';
 import { usePathname, useRouter } from 'next/navigation';
 import { useAuth } from './state/AuthContext';
 
 export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const isLogin = pathname === '/login';
    if (!user && !isLogin) {
      router.replace('/login');
    }
    if (user && isLogin) {
      router.replace('/');
    }
  }, [user, isLoading, pathname, router]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user && pathname !== '/login') {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>;
  }

  return <>{children}</>;
}
