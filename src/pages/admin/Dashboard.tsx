import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { Menfess, MenfessStatus } from '@/types';
import { AdminLayout } from '@/components/AdminLayout';
import { MenfessCardPreview } from '@/components/MenfessCardPreview';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  CheckCircle,
  XCircle,
  Trash2,
  Eye,
  Search,
  Clock,
  Check,
  X,
  Filter,
  Sparkles,
  Download,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [menfessList, setMenfessList] = useState<Menfess[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [activeTab, setActiveTab] = useState<MenfessStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Preview Drawer Modal
  const [previewItem, setPreviewItem] = useState<Menfess | null>(null);

  // Delete Confirmation Modal
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

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

  // Real-time Firestore Subscription
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const q = query(collection(db, 'menfess'), orderBy('created_at', sortOrder));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: Menfess[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        })) as Menfess[];

        setMenfessList(items);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching Firestore menfess:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, sortOrder]);

  // Update Status Action
  const handleUpdateStatus = async (id: string, newStatus: MenfessStatus) => {
    try {
      const docRef = doc(db, 'menfess', id);
      await updateDoc(docRef, {
        status: newStatus,
        updated_at: serverTimestamp()
      });
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Gagal mengupdate status. Silakan coba lagi.');
    }
  };

  // Delete Document Action
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsActionLoading(true);
    try {
      await deleteDoc(doc(db, 'menfess', deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('Gagal menghapus pesan. Silakan coba lagi.');
    } finally {
      setIsActionLoading(false);
    }
  };

  // Filter & Search Logic
  const filteredMenfess = menfessList.filter((item) => {
    const matchesTab = activeTab === 'all' || item.status === activeTab;

    const queryLower = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !queryLower ||
      (item.from_name && item.from_name.toLowerCase().includes(queryLower)) ||
      (item.to_name && item.to_name.toLowerCase().includes(queryLower)) ||
      (item.message && item.message.toLowerCase().includes(queryLower));

    return matchesTab && matchesSearch;
  });

  // Calculate Counters
  const counts = {
    all: menfessList.length,
    pending: menfessList.filter((i) => i.status === 'pending').length,
    approved: menfessList.filter((i) => i.status === 'approved').length,
    rejected: menfessList.filter((i) => i.status === 'rejected').length
  };

  const formatDateStr = (timestamp: any) => {
    if (!timestamp) return 'Baru saja';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gempala-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-gempala-secondary">Memuat Admin Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout title="Kelola Menfess">
      {/* Stat Cards Header */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div
          onClick={() => setActiveTab('all')}
          className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
            activeTab === 'all' ? 'border-gempala-primary ring-2 ring-gempala-primary/10' : 'border-gempala-border hover:border-gempala-secondary/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gempala-secondary uppercase">Total Pesan</span>
            <Filter className="w-4 h-4 text-gempala-secondary" />
          </div>
          <p className="text-3xl font-bold text-gempala-primary mt-2">{counts.all}</p>
        </div>

        <div
          onClick={() => setActiveTab('pending')}
          className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
            activeTab === 'pending' ? 'border-amber-500 ring-2 ring-amber-500/10 bg-amber-50/20' : 'border-gempala-border hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase">Menunggu</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-amber-600 mt-2">{counts.pending}</p>
        </div>

        <div
          onClick={() => setActiveTab('approved')}
          className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
            activeTab === 'approved' ? 'border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/20' : 'border-gempala-border hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase">Disetujui</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{counts.approved}</p>
        </div>

        <div
          onClick={() => setActiveTab('rejected')}
          className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-2xs ${
            activeTab === 'rejected' ? 'border-rose-500 ring-2 ring-rose-500/10 bg-rose-50/20' : 'border-gempala-border hover:border-rose-400'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 uppercase">Ditolak</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-3xl font-bold text-rose-600 mt-2">{counts.rejected}</p>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-gempala-border mb-6 shadow-xs flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {(
            [
              { id: 'all', label: 'Semua', count: counts.all },
              { id: 'pending', label: 'Pending', count: counts.pending },
              { id: 'approved', label: 'Approved', count: counts.approved },
              { id: 'rejected', label: 'Rejected', count: counts.rejected }
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-gempala-primary text-white shadow-xs'
                  : 'bg-gempala-bg text-gempala-secondary hover:text-gempala-primary hover:bg-gempala-border/50'
              }`}
            >
              {tab.label}
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gempala-border text-gempala-secondary'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-gempala-secondary absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Cari pesan / pengirim..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border border-gempala-border bg-gempala-bg text-sm focus:outline-none focus:ring-2 focus:ring-gempala-accent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 text-gempala-secondary hover:text-gempala-primary"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="h-11 px-3.5 rounded-xl border border-gempala-border bg-gempala-bg text-xs font-bold text-gempala-secondary hover:text-gempala-primary flex items-center gap-1.5"
            title="Urutkan Waktu"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}
          </button>
        </div>
      </div>

      {/* Menfess List Grid */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gempala-border animate-pulse h-32" />
          ))}
        </div>
      ) : filteredMenfess.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gempala-border my-8">
          <Clock className="w-12 h-12 text-gempala-secondary/40 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gempala-primary">Tidak Ada Menfess</h3>
          <p className="text-sm text-gempala-secondary mt-1">
            {searchQuery ? 'Tidak ditemukan menfess yang cocok dengan pencarian Anda.' : 'Belum ada pesan menfess di kategori ini.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMenfess.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-gempala-border shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row gap-5 justify-between"
            >
              {/* Left Column: Details */}
              <div className="flex-1 space-y-3">
                {/* Meta Header */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Status Badge */}
                  {item.status === 'pending' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                  {item.status === 'approved' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Approved
                    </span>
                  )}
                  {item.status === 'rejected' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Rejected
                    </span>
                  )}

                  <span className="text-xs font-medium text-gempala-secondary">
                    {formatDateStr(item.created_at)}
                  </span>
                </div>

                {/* Sender & Recipient Info */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold">
                  <div>
                    <span className="text-gempala-secondary text-xs uppercase block">Dari</span>
                    <span className="text-gempala-primary">
                      {item.is_anonymous ? 'Anonim 🤫' : item.from_name || 'Anonim'}
                    </span>
                  </div>
                  <span className="text-gempala-secondary">&rarr;</span>
                  <div>
                    <span className="text-gempala-secondary text-xs uppercase block">Untuk</span>
                    <span className="text-gempala-accent font-bold">{item.to_name}</span>
                  </div>
                </div>

                {/* Message Body */}
                <p className="text-base text-gempala-primary font-medium bg-gempala-bg/60 p-4 rounded-2xl border border-gempala-border/60 whitespace-pre-wrap break-words">
                  "{item.message}"
                </p>

                {item.admin_note && (
                  <div className="text-xs text-gempala-secondary bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-800">Catatan Admin:</span> {item.admin_note}
                  </div>
                )}
              </div>

              {/* Right Column: Actions */}
              <div className="flex md:flex-col items-center justify-end gap-2 border-t md:border-t-0 md:border-l border-gempala-border pt-4 md:pt-0 md:pl-5 shrink-0">
                {/* Approve Button */}
                {item.status !== 'approved' && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 gap-1 text-xs"
                    onClick={() => handleUpdateStatus(item.id!, 'approved')}
                  >
                    <Check className="w-3.5 h-3.5" /> Setujui
                  </Button>
                )}

                {/* Reject Button */}
                {item.status !== 'rejected' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full text-rose-600 border-rose-200 hover:bg-rose-50 gap-1 text-xs"
                    onClick={() => handleUpdateStatus(item.id!, 'rejected')}
                  >
                    <X className="w-3.5 h-3.5" /> Tolak
                  </Button>
                )}

                {/* View Detail & Card Generator */}
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full gap-1 text-xs"
                  onClick={() => navigate(`/admin/menfess/${item.id}`)}
                >
                  <Eye className="w-3.5 h-3.5" /> Detail & Kartu
                </Button>

                {/* Quick Preview Card Drawer Trigger */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full gap-1 text-xs text-gempala-secondary hover:text-gempala-primary"
                  onClick={() => setPreviewItem(item)}
                >
                  <Download className="w-3.5 h-3.5" /> Pratinjau
                </Button>

                {/* Delete Document */}
                <button
                  onClick={() => setDeleteId(item.id!)}
                  className="p-2 text-gempala-secondary hover:text-gempala-danger hover:bg-rose-50 rounded-xl transition-colors"
                  title="Hapus Pesan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Card Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] max-w-xl w-full p-6 shadow-2xl relative my-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gempala-border">
              <h3 className="font-bold text-lg text-gempala-primary">Pratinjau Kartu Instagram</h3>
              <button
                onClick={() => setPreviewItem(null)}
                className="p-2 rounded-full hover:bg-gempala-bg text-gempala-secondary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <MenfessCardPreview menfess={previewItem} />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-md w-full p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-gempala-primary">Hapus Pesan Menfess?</h3>
            <p className="text-sm text-gempala-secondary">
              Tindakan ini permanen dan dokumen akan dihapus dari Firestore.
            </p>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setDeleteId(null)}
                disabled={isActionLoading}
              >
                Batal
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDelete}
                isLoading={isActionLoading}
              >
                Hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}