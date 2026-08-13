import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { CardTheme, Menfess } from '@/types';
import { Download, Sparkles, Copy, Check, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/Button';

export const CARD_THEMES: CardTheme[] = [
  {
    id: 'gempala',
    name: 'Gempala Classic',
    bgGradient: 'from-[#F8F6F1] to-[#EFECE6]',
    cardBg: '#FFFFFF',
    textColor: '#171717',
    secondaryTextColor: '#6F6F6F',
    accentColor: '#FF6B5F',
    borderColor: '#E7E3DB',
  },
  {
    id: 'sunset',
    name: 'Warm Sunset',
    bgGradient: 'from-[#FFF4F0] via-[#FFEAE3] to-[#FFD8CC]',
    cardBg: '#FFFFFF',
    textColor: '#2D1515',
    secondaryTextColor: '#8C574F',
    accentColor: '#FF5E36',
    borderColor: '#FFD3C4',
  },
  {
    id: 'dark',
    name: 'Sleek Dark',
    bgGradient: 'from-[#141414] via-[#1A1A1E] to-[#222228]',
    cardBg: '#1F1F24',
    textColor: '#FFFFFF',
    secondaryTextColor: '#A0A0AA',
    accentColor: '#FF6B5F',
    borderColor: '#2E2E36',
  },
  {
    id: 'pastel',
    name: 'Pastel Dream',
    bgGradient: 'from-[#FDF0F6] via-[#F8E7F0] to-[#EFE3F7]',
    cardBg: '#FFFFFF',
    textColor: '#3A2035',
    secondaryTextColor: '#825C7B',
    accentColor: '#E64980',
    borderColor: '#F3D2E4',
  },
  {
    id: 'forest',
    name: 'Emerald Forest',
    bgGradient: 'from-[#EBF5F0] via-[#D8EBE2] to-[#C3E1D4]',
    cardBg: '#FFFFFF',
    textColor: '#143628',
    secondaryTextColor: '#4B7362',
    accentColor: '#2E8B57',
    borderColor: '#B9DEC9',
  },
  {
    id: 'minimal',
    name: 'Pure Minimal',
    bgGradient: 'from-[#FFFFFF] to-[#F3F4F6]',
    cardBg: '#FFFFFF',
    textColor: '#000000',
    secondaryTextColor: '#6B7280',
    accentColor: '#111827',
    borderColor: '#E5E7EB',
  }
];

interface MenfessCardPreviewProps {
  menfess: Menfess;
  showExportControls?: boolean;
}

export const MenfessCardPreview: React.FC<MenfessCardPreviewProps> = ({
  menfess,
  showExportControls = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('gempala');
  const [aspectRatio, setAspectRatio] = useState<'4:5' | '1:1' | '9:16'>('4:5');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentTheme = CARD_THEMES.find(t => t.id === selectedThemeId) || CARD_THEMES[0];

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 3, // High quality render
      });
      const link = document.createElement('a');
      const filename = `menfess-gempala-${menfess.id || Date.now()}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export card image:', err);
      alert('Gagal mengunduh gambar kartu. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 3 });
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Clipboard error:', err);
      alert('Fitur salin gambar tidak didukung di browser ini. Gunakan tombol unduh.');
    } finally {
      setIsExporting(false);
    }
  };

  const getAspectClasses = () => {
    switch (aspectRatio) {
      case '1:1':
        return 'aspect-square max-w-[340px]';
      case '9:16':
        return 'aspect-[9/16] max-w-[240px]';
      case '4:5':
      default:
        return 'aspect-[4/5] max-w-[300px]';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Hari ini';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
    return new Date(timestamp).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Controls Bar */}
      {showExportControls && (
        <div className="flex flex-col gap-4 w-full bg-white p-4 rounded-2xl border border-gempala-border shadow-sm">
          {/* Theme Selector */}
          <div>
            <label className="text-xs font-bold text-gempala-secondary uppercase tracking-wider block mb-2">
              Pilihan Tema Kartu
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {CARD_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedThemeId(theme.id)}
                  className={`p-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-1 border transition-all ${
                    selectedThemeId === theme.id
                      ? 'border-gempala-accent ring-2 ring-gempala-accent/20 scale-105 shadow-sm'
                      : 'border-gempala-border hover:bg-gempala-bg'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full bg-gradient-to-br ${theme.bgGradient} border border-black/10 shadow-inner`}
                  />
                  <span className="truncate w-full text-center">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio Selector & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gempala-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gempala-secondary uppercase">Rasio:</span>
              <div className="inline-flex rounded-lg bg-gempala-bg p-1 border border-gempala-border">
                {(['4:5', '1:1', '9:16'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                      aspectRatio === ratio
                        ? 'bg-white text-gempala-primary shadow-xs'
                        : 'text-gempala-secondary hover:text-gempala-primary'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyImage}
                isLoading={isExporting}
                className="gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-gempala-success" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Tersalin!' : 'Salin Gambar'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleDownload}
                isLoading={isExporting}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Unduh Kartu PNG
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Card Preview Container */}
      <div className="w-full flex justify-center p-2 sm:p-4 overflow-x-auto">
        <div
          ref={cardRef}
          className={`w-full ${getAspectClasses()} bg-gradient-to-br ${currentTheme.bgGradient} p-5 rounded-[28px] shadow-lg flex flex-col justify-between relative overflow-hidden transition-all`}
          style={{ minHeight: aspectRatio === '9:16' ? '380px' : '300px' }}
        >
          {/* Header Branding */}
          <div className="flex justify-between items-start z-10">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden border"
                style={{ backgroundColor: '#FFFFFF', borderColor: currentTheme.borderColor }}
              >
                <img
                  src="/logo.webp"
                  alt="Gempala"
                  className="w-full h-full object-contain p-0.5"
                  crossOrigin="anonymous"
                />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight leading-none" style={{ color: currentTheme.textColor }}>
                  GEMPALA
                </h3>
                <span className="text-[10px] font-semibold tracking-widest uppercase opacity-70" style={{ color: currentTheme.secondaryTextColor }}>
                  menfess
                </span>
              </div>
            </div>
            <div
              className="px-3 py-1 rounded-full text-[11px] font-semibold border"
              style={{
                backgroundColor: currentTheme.cardBg,
                color: currentTheme.secondaryTextColor,
                borderColor: currentTheme.borderColor
              }}
            >
              {formatDate(menfess.created_at)}
            </div>
          </div>

          {/* Card Body - Message */}
          <div className="my-auto py-6 z-10 flex flex-col justify-center">
            {/* Sender & Recipient Headers */}
            <div className="mb-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold opacity-75" style={{ color: currentTheme.secondaryTextColor }}>
                <span>DARI:</span>
                <span className="font-bold uppercase tracking-wider" style={{ color: currentTheme.textColor }}>
                  {menfess.is_anonymous ? 'Anonim 🤫' : (menfess.from_name || 'Anonim')}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: currentTheme.accentColor }}>
                <span>UNTUK:</span>
                <span className="uppercase tracking-wide">{menfess.to_name}</span>
                {menfess.tag_request && (
                  <span className="text-xs font-semibold opacity-80" style={{ color: currentTheme.accentColor }}>
                    ({menfess.tag_request})
                  </span>
                )}
              </div>
            </div>

            {/* Main Message Box */}
            <div
              className="p-5 sm:p-6 rounded-2xl border shadow-xs transition-all relative"
              style={{
                backgroundColor: currentTheme.cardBg,
                borderColor: currentTheme.borderColor,
                color: currentTheme.textColor
              }}
            >
              <span
                className="absolute -top-3 left-4 text-2xl font-serif leading-none px-1"
                style={{ backgroundColor: currentTheme.cardBg, color: currentTheme.accentColor }}
              >
                “
              </span>
              <p className="text-base sm:text-lg font-medium leading-relaxed whitespace-pre-wrap break-words">
                {menfess.message}
              </p>
              <span
                className="absolute -bottom-4 right-4 text-2xl font-serif leading-none px-1"
                style={{ backgroundColor: currentTheme.cardBg, color: currentTheme.accentColor }}
              >
                ”
              </span>
            </div>
          </div>

          {/* Footer Branding & Watermark */}
          <div className="flex justify-between items-end pt-2 border-t border-black/5 z-10">
            <div className="text-[11px] font-medium opacity-80" style={{ color: currentTheme.secondaryTextColor }}>
              Kirim menfess kamu di <span className="font-bold" style={{ color: currentTheme.textColor }}>gempala.menfess</span>
            </div>
            <Sparkles className="w-4 h-4 opacity-60" style={{ color: currentTheme.accentColor }} />
          </div>

          {/* Subtle Decorative Circle */}
          <div
            className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full opacity-10 pointer-events-none"
            style={{ backgroundColor: currentTheme.accentColor }}
          />
        </div>
      </div>
    </div>
  );
};
