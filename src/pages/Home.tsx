import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Menfess } from '@/types';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    message: '',
    isAnonymous: false,
    website: '' // honeypot
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Honeypot check
    if (formData.website) {
      setErrorMsg('Waduh, terdeteksi aktivitas mencurigakan nih.');
      return;
    }

    if (!formData.to.trim() || !formData.message.trim()) {
      setErrorMsg('Kolom BUAT SIAPA dan PESAN wajib diisi yaa.');
      return;
    }

    setIsLoading(true);

    try {
      const menfessData: Partial<Menfess> = {
        to_name: formData.to.trim(),
        message: formData.message.trim(),
        is_anonymous: formData.isAnonymous,
        status: 'pending',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };

      if (!formData.isAnonymous && formData.from.trim()) {
        menfessData.from_name = formData.from.trim();
      }

      await addDoc(collection(db, 'menfess'), menfessData);

      navigate('/success');
    } catch (error) {
      console.error("Error adding document: ", error);
      setErrorMsg('Pesan belum terkirim nih. Coba pencet tombol kirim sekali lagi ya!');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-5 py-10 md:py-16 animate-in fade-in duration-300">
      {/* Brand Header with Gempala Logo */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 mx-auto mb-3 flex items-center justify-center p-2 rounded-3xl bg-white shadow-xs border border-gempala-border transform hover:scale-105 transition-transform duration-300">
          <img
            src="/logo.webp"
            alt="Gempala Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gempala-primary">
          GEMPALA <span className="text-gempala-accent">menfess</span>
        </h1>
        <p className="text-gempala-secondary text-base md:text-lg font-medium mt-2 max-w-sm mx-auto leading-relaxed">
          kirim pesan rahasia, ghibah manis, atau ungkapan hati buat seseorang ✨
        </p>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[36px] p-6 md:p-8 shadow-sm border border-gempala-border space-y-6">
        {/* FROM */}
        <div className="transition-opacity duration-300" style={{ opacity: formData.isAnonymous ? 0.4 : 1 }}>
          <Input
            label="DARI SIAPA NIH? (OPSIONAL)"
            name="from"
            placeholder="nama kamu / username IG / inisial aja... 🤫"
            value={formData.from}
            onChange={handleChange}
            disabled={formData.isAnonymous}
            maxLength={80}
          />
        </div>

        {/* TO */}
        <Input
          label="BUAT SIAPA NIH?"
          name="to"
          placeholder="nama target, kalau malu pakai inisial aja best 🫣"
          value={formData.to}
          onChange={handleChange}
          maxLength={80}
          required
        />

        {/* MESSAGE */}
        <Textarea
          label="ISI PESAN KAMU"
          name="message"
          placeholder="tumpahkan isi hatimu di sini, bebas curhat apa aja... kangen, naksir, atau sekadar pengen nyapa ✨"
          value={formData.message}
          onChange={handleChange}
          maxLength={600}
          required
        />

        {/* HONEYPOT */}
        <div className="hidden" aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} value={formData.website} onChange={handleChange} />
        </div>

        {/* ANONYMOUS CHECKBOX */}
        <div className="pt-1">
          <Checkbox
            label="Kirim rahasia (spill tanpa nama) 🤫"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
          />
        </div>

        {errorMsg && (
          <div className="p-4 bg-gempala-accent-soft text-gempala-danger rounded-2xl text-center text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            className="w-full text-lg shadow-sm font-bold"
            isLoading={isLoading}
          >
            {isLoading ? 'MENGIRIM PESAN...' : 'KIRIM MENFESS ✨'}
          </Button>
          <p className="text-center text-xs font-medium text-gempala-secondary mt-4">
            Pesan kamu bakal di-review admin dulu<br />sebelum diposting ke IG Story Gempala ✨
          </p>
        </div>
      </form>
    </div>
  );
}