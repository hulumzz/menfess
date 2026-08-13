import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/Button';
import { Sparkles } from 'lucide-react';

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-5 py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-16 h-16 bg-gempala-accent-soft rounded-full flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-gempala-accent" />
      </div>
      
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4 uppercase">
        Menfess Terkirim
      </h1>
      
      <p className="text-gempala-secondary text-lg text-center mb-10 max-w-sm">
        pesanmu sudah sampai<br/>ke admin Gempala.
      </p>

      <Button 
        onClick={() => navigate('/')} 
        variant="primary" 
        className="w-full max-w-xs text-lg shadow-sm"
      >
        KIRIM LAGI 💌
      </Button>
      
      <button 
        onClick={() => window.location.href = 'https://instagram.com/gempala'} 
        className="mt-6 text-sm font-medium text-gempala-secondary hover:text-gempala-primary transition-colors"
      >
        kembali ke Gempala
      </button>
    </div>
  );
}