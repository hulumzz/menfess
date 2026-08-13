import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { signInWithEmailAndPassword, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Shield, Eye, EyeOff, KeyRound } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnonLoading, setIsAnonLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/admin');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Email dan Password wajib diisi.');
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      navigate('/admin');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setErrorMsg('Email atau password tidak sesuai.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('Format email tidak valid.');
      } else {
        setErrorMsg(err.message || 'Gagal masuk. Periksa koneksi internet Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setErrorMsg('');
    setIsAnonLoading(true);
    try {
      await signInAnonymously(auth);
      navigate('/admin');
    } catch (err: any) {
      console.error('Anonymous login error:', err);
      setErrorMsg('Gagal masuk cepat. Pastikan Anonymous Auth diaktifkan di Firebase Console.');
    } finally {
      setIsAnonLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col items-center justify-center p-5 font-body">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-3xl mx-auto flex items-center justify-center p-2.5 shadow-sm border border-gempala-border mb-4">
            <img src="/logo.webp" alt="Gempala Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gempala-primary">
            Admin <span className="text-gempala-accent">Portal</span>
          </h1>
          <p className="text-gempala-secondary text-sm mt-1">
            Masuk untuk verifikasi dan kelola pesan Menfess Gempala
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-sm border border-gempala-border">
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div>
              <Input
                label="Email Admin"
                type="email"
                placeholder="admin@gempala.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-10 text-gempala-secondary hover:text-gempala-primary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-gempala-accent-soft text-gempala-danger rounded-2xl text-center text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full text-base font-bold shadow-xs mt-2"
              isLoading={isLoading}
            >
              MASUK KE DASHBOARD
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gempala-border" />
            </div>
            <span className="relative bg-white px-4 text-xs font-semibold text-gempala-secondary uppercase">
              atau
            </span>
          </div>

          {/* Quick Anonymous Login Option */}
          <Button
            type="button"
            variant="secondary"
            className="w-full gap-2 text-sm"
            onClick={handleQuickLogin}
            isLoading={isAnonLoading}
          >
            <KeyRound className="w-4 h-4 text-gempala-accent" />
            Akses Cepat (Anonymous Admin)
          </Button>

          <p className="text-center text-xs text-gempala-secondary mt-6">
            Gempala Menfess &bull; Verifikasi Manual Admin
          </p>
        </div>
      </div>
    </div>
  );
}