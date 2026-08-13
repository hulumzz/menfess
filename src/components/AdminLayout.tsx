import React from 'react';
import { useNavigate } from 'react-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { LogOut, Shield, ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title = 'Admin Portal',
  showBackButton = false
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const user = auth.currentUser;

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col font-body text-[#171717]">
      {/* Admin Header Bar */}
      <header className="bg-white border-b border-gempala-border sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton ? (
              <button
                onClick={() => navigate('/admin')}
                className="p-2 rounded-xl text-gempala-secondary hover:text-gempala-primary hover:bg-gempala-bg transition-colors"
                title="Kembali ke Dashboard"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-white border border-gempala-border flex items-center justify-center p-1 shadow-xs">
                <img src="/logo.webp" alt="Gempala Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-lg tracking-tight leading-none">
                  GEMPALA <span className="text-gempala-accent">Admin</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gempala-accent-soft text-gempala-accent uppercase">
                  Portal
                </span>
              </div>
              <span className="text-xs text-gempala-secondary">{title}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden md:flex flex-col items-end text-xs">
                <span className="font-semibold text-gempala-primary">
                  {user.email || 'Admin Gempala'}
                </span>
                <span className="text-gempala-secondary font-mono text-[10px]">
                  ID: {user.uid.slice(0, 8)}...
                </span>
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gempala-secondary hover:text-gempala-danger gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-gempala-border py-4 bg-white/50 text-center text-xs text-gempala-secondary">
        Gempala Menfess Admin Panel &bull; Verifikasi Manual Admin
      </footer>
    </div>
  );
};
