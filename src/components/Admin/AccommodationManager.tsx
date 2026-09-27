import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  Building2, 
  Plus, 
  QrCode, 
  Printer, 
  Download, 
  Smartphone, 
  MapPin, 
  Phone, 
  User, 
  Users, 
  Star, 
  ExternalLink,
  X,
  Check,
  Sparkles
} from 'lucide-react';
import { Accommodation, FeedbackSubmission } from '../../types';
import { addAccommodation, calculateMetrics } from '../../utils/storage';
import { INITIAL_ACCOMMODATIONS } from '../../data/initialData';

interface AccommodationManagerProps {
  accommodations: Accommodation[];
  submissions: FeedbackSubmission[];
  onAccommodationsChange: () => void;
  onSimulateScan: (propertyId: string) => void;
}

export const AccommodationManager: React.FC<AccommodationManagerProps> = ({
  accommodations = [],
  submissions = [],
  onAccommodationsChange,
  onSimulateScan
}) => {
  const safeAccommodations = accommodations.length > 0 ? accommodations : INITIAL_ACCOMMODATIONS;
  const [qrDataUrls, setQrDataUrls] = useState<Record<string, string>>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [printableStandAcc, setPrintableStandAcc] = useState<Accommodation | null>(null);

  // New Accommodation form state
  const [newAcc, setNewAcc] = useState({
    name: '',
    code: '',
    city: 'مشهد مقدس',
    address: '',
    roomCount: 10,
    capacity: 40,
    managerName: '',
    managerPhone: '',
    notes: ''
  });

  // Generate QR codes for all accommodations
  useEffect(() => {
    const generateCodes = async () => {
      const urls: Record<string, string> = {};
      for (const acc of safeAccommodations) {
        try {
          const appOrigin = window.location.origin + window.location.pathname;
          const targetUrl = `${appOrigin}?property=${acc.id}`;
          const dataUrl = await QRCode.toDataURL(targetUrl, {
            width: 360,
            margin: 2,
            color: {
              dark: '#1c1917', // stone-900
              light: '#ffffff'
            }
          });
          urls[acc.id] = dataUrl;
        } catch (err) {
          console.error('Error generating QR code', err);
        }
      }
      setQrDataUrls(urls);
    };

    generateCodes();
  }, [accommodations]);

  const handleDownloadQr = (acc: Accommodation) => {
    const dataUrl = qrDataUrls[acc.id];
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `qrcode_${acc.code}_parhoon_tarh.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintStand = (acc: Accommodation) => {
    setPrintableStandAcc(acc);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleCreateAccommodation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAcc.name.trim() || !newAcc.code.trim()) return;

    addAccommodation({
      name: newAcc.name.trim(),
      code: newAcc.code.trim(),
      city: newAcc.city.trim(),
      address: newAcc.address.trim(),
      roomCount: Number(newAcc.roomCount) || 10,
      capacity: Number(newAcc.capacity) || 40,
      managerName: newAcc.managerName.trim(),
      managerPhone: newAcc.managerPhone.trim(),
      active: true,
      notes: newAcc.notes.trim()
    });

    setIsAddModalOpen(false);
    setNewAcc({
      name: '',
      code: '',
      city: 'مشهد مقدس',
      address: '',
      roomCount: 10,
      capacity: 40,
      managerName: '',
      managerPhone: '',
      notes: ''
    });
    onAccommodationsChange();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>مدیریت املاک و اقامتگاه‌ها</span>
              <span aria-hidden="true">·</span>
              <span>کدهای QR هوشمند</span>
            </div>
            <h1 className="text-lg font-bold text-stone-900">
              زائرخانه‌های پرهون طرح و صدور کدهای QR اختصاصی
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              جهت نصب در اتاق‌ها، لابی و پشت درب ورودی سوئیت‌ها به منظور دریافت بی‌واسطه نظرات زائران محترم
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-xs cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>افزودن زائرخانه جدید</span>
          </button>
        </div>
      </div>

      {/* Accommodations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {safeAccommodations.map((acc) => {
          const metrics = calculateMetrics(acc.id, submissions);
          const qrUrl = qrDataUrls[acc.id];

          return (
            <div 
              key={acc.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black font-mono text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                        کد {acc.code}
                      </span>
                      <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                        فعال و در حال خدمت‌رسانی
                      </span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-stone-900 mt-1">
                      {acc.name}
                    </h2>
                    <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{acc.address}</span>
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 text-stone-700">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>

                {/* QR Code and Quick Details Section */}
                <div className="flex flex-col sm:flex-row items-center gap-5 bg-stone-50 border border-stone-200/70 rounded-xl p-4 mb-4">
                  {/* QR Image Box */}
                  <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs shrink-0 text-center">
                    {qrUrl ? (
                      <img 
                        src={qrUrl} 
                        alt={`QR Code ${acc.name}`} 
                        className="w-28 h-28 mx-auto"
                      />
                    ) : (
                      <div className="w-28 h-28 bg-stone-100 flex items-center justify-center text-xs text-stone-400">
                        در حال ساخت کد...
                      </div>
                    )}
                    <span className="text-[10px] text-stone-500 block mt-1">
                      کد اسکن ویژه اتاق‌ها
                    </span>
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 space-y-2 text-xs text-stone-600 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">مدیریت واحد:</span>
                      <span className="font-semibold text-stone-800">{acc.managerName || 'نامشخص'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">تلفن هماهنگی:</span>
                      <span className="font-mono text-stone-800" dir="ltr">{acc.managerPhone || '۰۹۱۵۰۰۰۰۰۰۰'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">تعداد اتاق / ظرفیت:</span>
                      <span className="font-mono font-semibold text-stone-800">
                        {acc.roomCount} واحد ({acc.capacity} نفر)
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-stone-200">
                      <span className="text-stone-400">میانگین رضایت:</span>
                      <span className="font-mono font-bold text-amber-800 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{metrics.averageRating > 0 ? metrics.averageRating : '۰'} از ۵</span>
                      </span>
                    </div>
                  </div>
                </div>

                {acc.notes && (
                  <p className="text-xs text-stone-500 bg-stone-50/50 p-2.5 rounded-lg border border-stone-100 mb-4">
                    {acc.notes}
                  </p>
                )}

              </div>

              {/* Action Buttons for this Accommodation */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100">
                <button
                  onClick={() => onSimulateScan(acc.id)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-xs cursor-pointer"
                  title="باز کردن فرم نظرسنجی این اقامتگاه"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>اسکن فرضی</span>
                </button>

                <button
                  onClick={() => handlePrintStand(acc)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                  title="چاپ کارت رومیزی استند اتاق"
                >
                  <Printer className="w-3.5 h-3.5 text-stone-600" />
                  <span>چاپ استند</span>
                </button>

                <button
                  onClick={() => handleDownloadQr(acc)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                  title="دانلود فایل تصویری کد QR"
                >
                  <Download className="w-3.5 h-3.5 text-stone-600" />
                  <span>دانلود QR</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* ADD ACCOMMODATION MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-stone-900">
                ثبت و تعریف زائرخانه جدید پرهون طرح
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAccommodation} className="space-y-4">
              
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    نام زائرخانه <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: زائرخانه ۴۱۰ مشهد"
                    value={newAcc.name}
                    onChange={(e) => setNewAcc({ ...newAcc, name: e.target.value })}
                    required
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    کد <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: ۴۱۰"
                    value={newAcc.code}
                    onChange={(e) => setNewAcc({ ...newAcc, code: e.target.value })}
                    required
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  آدرس دقیق در مشهد
                </label>
                <input
                  type="text"
                  placeholder="خیابان، کوچه، پلاک و نزدیکی به حرم..."
                  value={newAcc.address}
                  onChange={(e) => setNewAcc({ ...newAcc, address: e.target.value })}
                  className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    تعداد سوئیت / اتاق
                  </label>
                  <input
                    type="number"
                    value={newAcc.roomCount}
                    onChange={(e) => setNewAcc({ ...newAcc, roomCount: Number(e.target.value) })}
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    ظرفیت کل پذیرش (نفر)
                  </label>
                  <input
                    type="number"
                    value={newAcc.capacity}
                    onChange={(e) => setNewAcc({ ...newAcc, capacity: Number(e.target.value) })}
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    نام مدیر / مسئول زائرخانه
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: آقای مرادی"
                    value={newAcc.managerName}
                    onChange={(e) => setNewAcc({ ...newAcc, managerName: e.target.value })}
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    شماره تماس مسئول
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="0915..."
                    value={newAcc.managerPhone}
                    onChange={(e) => setNewAcc({ ...newAcc, managerPhone: e.target.value })}
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-right"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl shadow-xs cursor-pointer"
                >
                  ثبت زائرخانه
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* PRINT-ONLY TABLE STAND SHEET */}
      {printableStandAcc && (
        <div className="print-only hidden p-8 text-center bg-white border-4 border-stone-800 rounded-3xl max-w-lg mx-auto my-12">
          
          <div className="w-16 h-16 rounded-2xl bg-stone-900 text-amber-400 flex items-center justify-center font-black text-3xl mx-auto mb-4">
            پ
          </div>

          <h2 className="text-xs tracking-widest text-stone-500 font-bold mb-1">
            شرکت پرهون طرح
          </h2>

          <h1 className="text-2xl font-black text-stone-900 mb-2">
            {printableStandAcc.name}
          </h1>

          <p className="text-xs text-stone-600 max-w-xs mx-auto mb-6">
            زائر گرامی، زیارت حضرت رضا (ع) قبول درگاه حق؛ لطفاً جهت ارتقای سطح کیفی خدمات، با دوربین گوشی خود بارکد زیر را اسکن نمایید:
          </p>

          <div className="inline-block p-4 bg-white border-2 border-stone-900 rounded-2xl shadow-lg mb-6">
            {qrDataUrls[printableStandAcc.id] && (
              <img 
                src={qrDataUrls[printableStandAcc.id]} 
                alt="QR Code" 
                className="w-56 h-56 mx-auto"
              />
            )}
          </div>

          <div className="text-sm font-bold text-stone-900 mb-1">
            سامانه هوشمند ثبت نظرسنجی و بازخورد اقامت
          </div>

          <div className="text-[11px] text-stone-400 font-mono mt-4">
            کد زائرخانه: {printableStandAcc.code} | پرهون طرح مشهد
          </div>
        </div>
      )}

    </div>
  );
};
