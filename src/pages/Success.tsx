import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Sparkles, Heart } from 'lucide-react';

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-5 py-12 animate-in fade-in zoom-in-95 duration-500 text-center">
      {/* Logo & Sparkle Badge */}
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-white rounded-3xl p-3 shadow-sm border border-gempala-border flex items-center justify-center mx-auto">
          <img src="/logo.webp" alt="Gempala Logo" className="w-full h-full object-contain" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-gempala-accent text-white p-2 rounded-full shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gempala-primary mb-3">
        MENFESS TERKIRIM! 🎉
      </h1>

      <p className="text-gempala-secondary text-base md:text-lg font-medium mb-8 max-w-sm leading-relaxed">
        pesanmu udah aman mendarat di admin Gempala. pantau IG Story buat liat kapan diposting yaa! ✨
      </p>

      <div className="w-full max-w-xs space-y-3">
        <Button
          onClick={() => navigate('/')}
          variant="primary"
          className="w-full text-base font-bold shadow-sm"
        >
          KIRIM MENFESS LAGI 💌
        </Button>

        <button
          onClick={() => window.location.href = 'https://instagram.com/gempala'}
          className="w-full py-3 text-sm font-semibold text-gempala-secondary hover:text-gempala-primary transition-colors flex items-center justify-center gap-1.5"
        >
          <Heart className="w-4 h-4 text-gempala-accent" />
          Cek Instagram Gempala
        </button>
      </div>
    </div>
  );
}