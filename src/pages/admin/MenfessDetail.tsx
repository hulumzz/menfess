import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { Menfess, MenfessStatus } from '@/types';
import { AdminLayout } from '@/components/AdminLayout';
import { MenfessCardPreview } from '@/components/MenfessCardPreview';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import {
  CheckCircle,
  XCircle,
  Clock,
  Save,
  Check,
  ShieldCheck
} from 'lucide-react';

export default function MenfessDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [menfess, setMenfess] = useState<Menfess | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<MenfessStatus>('pending');
  const [adminNote, setAdminNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Check Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/admin/login');
      } else {
        setUser(currentUser);
      }
      setIsAuthChecking(false);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Fetch Menfess Document
  useEffect(() => {
    if (!id || !user) return;

    const fetchDoc = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'menfess', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Menfess;
          setMenfess(data);
          setStatus(data.status);
          setAdminNote(data.admin_note || '');
        } else {
          alert('Dokumen menfess tidak ditemukan.');
          navigate('/admin');
        }
      } catch (err) {
        console.error('Error fetching menfess detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [id, user, navigate]);

  // Save Status & Admin Note Changes
  const handleSave = async () => {
    if (!id || !menfess) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const docRef = doc(db, 'menfess', id);
      await updateDoc(docRef, {
        status,
        admin_note: adminNote,
        updated_at: serverTimestamp()
      });

      setMenfess(prev => prev ? { ...prev, status, admin_note: adminNote } : null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating document:', err);
      alert('Gagal menyimpan perubahan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isAuthChecking || loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gempala-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-gempala-secondary">Memuat Detail Menfess...</span>
        </div>
      </div>
    );
  }

  if (!menfess) {
    return null;
  }

  return (
    <AdminLayout title={`Detail Menfess #${id?.slice(0, 6)}`} showBackButton>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Information & Manual Admin Verification */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header Info Card */}
          <div className="bg-white p-6 rounded-[32px] border border-gempala-border shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gempala-primary">Verifikasi Admin</h2>
              {status === 'pending' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Pending
                </span>
              )}
              {status === 'approved' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Approved
                </span>
              )}
              {status === 'rejected' && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Rejected
                </span>
              )}
            </div>

            {/* From & To Info */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-gempala-bg/60 border border-gempala-border">
              <div>
                <span className="text-xs font-bold text-gempala-secondary uppercase block mb-0.5">DARI</span>
                <span className="font-semibold text-gempala-primary text-sm">
                  {menfess.is_anonymous ? 'Anonim 🤫' : menfess.from_name || 'Anonim'}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-gempala-secondary uppercase block mb-0.5">UNTUK</span>
                <span className="font-bold text-gempala-accent text-sm">{menfess.to_name}</span>
              </div>
            </div>

            {/* Original Message Text */}
            <div>
              <label className="text-xs font-bold text-gempala-secondary uppercase tracking-wider block mb-1.5">
                Isi Pesan
              </label>
              <div className="p-4 rounded-2xl bg-white border border-gempala-border text-gempala-primary font-medium whitespace-pre-wrap break-words text-base leading-relaxed">
                "{menfess.message}"
              </div>
            </div>

            {/* Status Switcher & Save Button */}
            <div className="pt-2 space-y-4">
              <label className="text-xs font-bold text-gempala-secondary uppercase tracking-wider block">
                Ubah Status Dokumen
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('pending')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    status === 'pending'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-gempala-bg text-gempala-secondary hover:bg-amber-100/50'
                  }`}
                >
                  Pending
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('approved')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    status === 'approved'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gempala-bg text-gempala-secondary hover:bg-emerald-100/50'
                  }`}
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('rejected')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                    status === 'rejected'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-gempala-bg text-gempala-secondary hover:bg-rose-100/50'
                  }`}
                >
                  Reject
                </button>
              </div>

              {/* Admin Note */}
              <Textarea
                label="Catatan Admin (Internal)"
                placeholder="Tambah catatan internal admin jika ada..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                maxLength={200}
              />

              <Button
                variant="primary"
                onClick={handleSave}
                isLoading={isSaving}
                className="w-full gap-2 text-base font-bold shadow-xs"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-5 h-5 text-white" /> TERSIMPAN!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> SIMPAN PERUBAHAN
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Manual Verification Info Banner */}
          <div className="bg-white p-5 rounded-[24px] border border-gempala-border text-xs text-gempala-secondary flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-gempala-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gempala-primary block mb-0.5">Verifikasi Manual Admin</span>
              Admin bertindak penuh sebagai pemilah dan pemoderasi kelayakan pesan menfess sebelum diposting ke Instagram Story Gempala.
            </div>
          </div>
        </div>

        {/* Right Column: Instagram Card Generator */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 space-y-4">
            <h2 className="text-xl font-bold text-gempala-primary">Kartu Media Sosial</h2>
            <MenfessCardPreview menfess={menfess} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}