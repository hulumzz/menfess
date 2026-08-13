import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Menfess } from '@/types';

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
      setErrorMsg('Terdapat aktivitas mencurigakan.');
      return;
    }

    if (!formData.to.trim() || !formData.message.trim()) {
      setErrorMsg('Form TO dan PESAN wajib diisi.');
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
      setErrorMsg('Belum terkirim. Coba lagi sebentar.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-5 py-12 md:py-20 animate-in fade-in duration-300">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">GEMPALA<br/>menfess</h1>
        <p className="text-gempala-secondary text-lg">
          kirim sesuatu yang ingin<br/>kamu sampaikan ✨
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gempala-border">
        <div className="space-y-6">
          
          {/* FROM */}
          <div className="transition-opacity duration-300" style={{ opacity: formData.isAnonymous ? 0.5 : 1 }}>
            <Input 
              label="FROM"
              name="from"
              placeholder="Nama atau @username"
              value={formData.from}
              onChange={handleChange}
              disabled={formData.isAnonymous}
              maxLength={80}
            />
          </div>

          {/* TO */}
          <Input 
            label="TO"
            name="to"
            placeholder="Nama atau @username"
            value={formData.to}
            onChange={handleChange}
            maxLength={80}
            required
          />

          {/* MESSAGE */}
          <Textarea 
            label="PESAN"
            name="message"
            placeholder="Tulis sesuatu..."
            value={formData.message}
            onChange={handleChange}
            maxLength={600}
            required
          />

          {/* HONEYPOT */}
          <div className="hidden" aria-hidden="true">
            <input type="text" name="website" tabIndex={-1} value={formData.website} onChange={handleChange} />
          </div>

          {/* ANONYMOUS */}
          <div className="pt-2">
            <Checkbox 
              label="Kirim sebagai anonim"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
            />
          </div>

          {errorMsg && (
            <div className="p-4 bg-gempala-accent-soft text-gempala-danger rounded-2xl text-center text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full text-lg shadow-sm"
              isLoading={isLoading}
            >
              {isLoading ? 'MENGIRIM...' : 'KIRIM MENFESS ✨'}
            </Button>
            <p className="text-center text-sm text-gempala-secondary mt-4">
              Pesan akan dilihat admin<br/>sebelum diposting.
            </p>
          </div>

        </div>
      </form>
    </div>
  );
}