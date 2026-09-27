import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  Star, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  X,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { FeedbackSubmission, Accommodation, Question } from '../../types';
import { exportSubmissionsToCsv, updateSubmissionStatus } from '../../utils/storage';
import { INITIAL_ACCOMMODATIONS } from '../../data/initialData';

interface ResponsesTableProps {
  submissions: FeedbackSubmission[];
  accommodations: Accommodation[];
  questions: Question[];
  onSubmissionUpdated: () => void;
  selectedSubmissionForModal?: FeedbackSubmission | null;
  onCloseModal?: () => void;
}

export const ResponsesTable: React.FC<ResponsesTableProps> = ({
  submissions = [],
  accommodations = [],
  questions = [],
  onSubmissionUpdated,
  selectedSubmissionForModal,
  onCloseModal
}) => {
  const safeAccommodations = accommodations.length > 0 ? accommodations : INITIAL_ACCOMMODATIONS;
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeModalItem, setActiveModalItem] = useState<FeedbackSubmission | null>(
    selectedSubmissionForModal || null
  );

  // Sync prop changes
  React.useEffect(() => {
    if (selectedSubmissionForModal) {
      setActiveModalItem(selectedSubmissionForModal);
    }
  }, [selectedSubmissionForModal]);

  // Filtered submissions
  const filteredSubmissions = submissions.filter(sub => {
    if (propertyFilter !== 'all' && sub.propertyId !== propertyFilter) return false;
    if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const name = sub.guestInfo.fullName.toLowerCase();
      const mobile = sub.guestInfo.mobile.toLowerCase();
      const room = sub.guestInfo.roomNumber.toLowerCase();
      const city = sub.guestInfo.originCity.toLowerCase();
      const notes = (sub.generalNotes || '').toLowerCase();
      const tracking = sub.trackingCode.toLowerCase();
      return name.includes(q) || mobile.includes(q) || room.includes(q) || city.includes(q) || notes.includes(q) || tracking.includes(q);
    }
    return true;
  });

  const handleExport = () => {
    exportSubmissionsToCsv(filteredSubmissions);
  };

  const handleStatusChange = (subId: string, newStatus: FeedbackSubmission['status'], adminNotes?: string) => {
    updateSubmissionStatus(subId, newStatus, adminNotes);
    onSubmissionUpdated();
    if (activeModalItem && activeModalItem.id === subId) {
      setActiveModalItem({
        ...activeModalItem,
        status: newStatus,
        adminNotes: adminNotes !== undefined ? adminNotes : activeModalItem.adminNotes
      });
    }
  };

  const stayHistoryLabels: Record<string, string> = {
    first_time: 'بار اول',
    '2_to_3_times': '۲ الی ۳ بار',
    more_than_3: 'بیش از ۳ بار'
  };

  const affiliationLabels: Record<string, string> = {
    personnel: 'پرسنل پرهون طرح',
    family: 'خانواده همکار',
    corporate_guest: 'مهمان سازمانی',
    other: 'سایر مهمانان'
  };

  return (
    <div className="space-y-4">
      
      {/* Top Header & Search/Filter Controls */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-bold text-stone-900">
              مدیریت و بایگانی نظرات مهمانان
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              مشاهده سوابق اقامتی، اطلاعات تماس، پاسخ‌های تفصیلی و وضعیت بررسی بازخوردها
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>خروجی اکسل (CSV)</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-stone-100">
          
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="جستجو بر اساس نام، موبایل، اتاق یا شهر..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl pr-9 pl-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Property Filter */}
          <div className="relative">
            <select
              value={propertyFilter}
              onChange={(e) => setPropertyFilter(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="all">همه زائرخانه‌ها</option>
              {safeAccommodations.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="new">نظرات جدید</option>
              <option value="followup_needed">نیازمند اقدام و رسیدگی</option>
              <option value="reviewed">بررسی شده</option>
              <option value="resolved">اقدام شده و پایان یافته</option>
            </select>
          </div>

        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold">
              <tr>
                <th className="py-3.5 px-4">مهمان و اطلاعات تماس</th>
                <th className="py-3.5 px-3">زائرخانه و اتاق</th>
                <th className="py-3.5 px-3">سابقه اقامت</th>
                <th className="py-3.5 px-3 text-center">امتیاز کل</th>
                <th className="py-3.5 px-3">پیشنهاد به دیگران</th>
                <th className="py-3.5 px-3">وضعیت پیگیری</th>
                <th className="py-3.5 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    موردی مطابق با شرایط جستجو یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr 
                    key={sub.id} 
                    className="hover:bg-stone-50/70 transition-colors"
                  >
                    
                    {/* Guest & Contact */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{sub.guestInfo.fullName}</div>
                      <div className="text-[11px] text-stone-500 font-mono flex items-center gap-1 mt-0.5" dir="ltr">
                        <span>{sub.guestInfo.mobile}</span>
                        <span className="text-stone-300">·</span>
                        <span className="font-sans text-[10px] text-stone-400">{sub.guestInfo.originCity}</span>
                      </div>
                    </td>

                    {/* Accommodation & Room */}
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-stone-800">{sub.propertyName}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        واحد / اتاق: <strong className="text-stone-700 font-mono">{sub.guestInfo.roomNumber}</strong>
                      </div>
                    </td>

                    {/* Stay History */}
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-stone-800">
                        {stayHistoryLabels[sub.guestInfo.stayHistory] || sub.guestInfo.stayHistory}
                      </div>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        {affiliationLabels[sub.guestInfo.affiliation] || sub.guestInfo.affiliation}
                      </div>
                    </td>

                    {/* Overall Rating */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-mono font-bold text-amber-900 tabular-nums">
                          {sub.overallRating}
                        </span>
                      </div>
                    </td>

                    {/* Recommendation */}
                    <td className="py-3.5 px-3">
                      <span className={`text-[11px] font-medium ${
                        sub.recommendationChoice?.includes('قطعاً') ? 'text-emerald-700' : 'text-stone-600'
                      }`}>
                        {sub.recommendationChoice || '-'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.status === 'new'
                          ? 'bg-amber-100 text-amber-800'
                          : sub.status === 'followup_needed'
                          ? 'bg-rose-100 text-rose-800'
                          : sub.status === 'resolved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {sub.status === 'new' ? 'جدید' : sub.status === 'followup_needed' ? 'نیازمند اقدام' : sub.status === 'resolved' ? 'حل شد' : 'بررسی شد'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setActiveModalItem(sub)}
                        className="px-2.5 py-1 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                      >
                        مشاهده جزئیات
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 flex items-center justify-between">
          <span>
            نمایش <strong className="text-stone-800 font-mono tabular-nums">{filteredSubmissions.length}</strong> از{' '}
            <strong className="text-stone-800 font-mono tabular-nums">{submissions.length}</strong> نظر ثبت‌شده
          </span>
          <span className="text-[11px] text-stone-400">
            برای چاپ یا بایگانی اداری، از دکمه خروجی اکسل در بالا استفاده نمایید.
          </span>
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-2xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    {activeModalItem.trackingCode}
                  </span>
                  <span className="text-xs text-stone-500">
                    ثبت در: {new Date(activeModalItem.createdAt).toLocaleString('fa-IR')}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-stone-900 mt-1">
                  جزئیات کامل نظرسنجی {activeModalItem.guestInfo.fullName}
                </h2>
                <p className="text-xs text-stone-500">
                  {activeModalItem.propertyName} - واحد {activeModalItem.guestInfo.roomNumber}
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveModalItem(null);
                  if (onCloseModal) onCloseModal();
                }}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Guest Contact Card (Hardcoded info) */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 mb-6">
              <h3 className="text-xs font-bold text-stone-800 mb-3 flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-600" />
                <span>اطلاعات تماس و سوابق مسافر</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 block text-[10px]">شماره تماس:</span>
                  <span className="font-mono font-bold text-stone-800 text-left block" dir="ltr">
                    {activeModalItem.guestInfo.mobile}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">کد ملی:</span>
                  <span className="font-mono text-stone-800">
                    {activeModalItem.guestInfo.nationalId || 'ثبت نشده'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">شهر مبدأ:</span>
                  <span className="font-semibold text-stone-800">
                    {activeModalItem.guestInfo.originCity}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">سابقه اقامت در پرهون طرح:</span>
                  <span className="font-semibold text-stone-800">
                    {stayHistoryLabels[activeModalItem.guestInfo.stayHistory] || activeModalItem.guestInfo.stayHistory}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">نسبت / وابستگی:</span>
                  <span className="font-semibold text-stone-800">
                    {affiliationLabels[activeModalItem.guestInfo.affiliation] || activeModalItem.guestInfo.affiliation}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">تعداد همراهان:</span>
                  <span className="font-mono text-stone-800">
                    {activeModalItem.guestInfo.guestCount} نفر
                  </span>
                </div>
              </div>
            </div>

            {/* Questionnaire Answers */}
            <div className="mb-6">
              <h3 className="text-xs font-bold text-stone-800 mb-3 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>پاسخ‌های پرسشنامه ارزیابی اقامتگاه</span>
              </h3>

              <div className="space-y-3">
                {questions
                  .filter(q => q.propertyId === 'all' || q.propertyId === activeModalItem.propertyId)
                  .sort((a, b) => a.order - b.order)
                  .map((q, idx) => {
                    const ans = activeModalItem.answers[q.id];
                    return (
                      <div key={q.id} className="p-3 bg-stone-50/60 border border-stone-200 rounded-xl text-xs">
                        <div className="text-stone-500 font-medium mb-1">
                          {idx + 1}. {q.title}
                        </div>
                        <div className="font-bold text-stone-900">
                          {q.type === 'rating_5' ? (
                            <span className="flex items-center gap-1 text-amber-700">
                              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                              <span>{ans ? `${ans} از ۵ ستاره` : 'بدون پاسخ'}</span>
                            </span>
                          ) : (
                            <span>{ans !== undefined && ans !== null && ans !== '' ? String(ans) : 'بدون پاسخ'}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Admin Notes & Status Updating */}
            <div className="border-t border-stone-200 pt-4">
              <h3 className="text-xs font-bold text-stone-800 mb-2">
                اقدامات و پیگیری مدیر رفاهی پرهون طرح
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs text-stone-500">تغییر وضعیت:</span>
                {(['new', 'followup_needed', 'reviewed', 'resolved'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(activeModalItem.id, st)}
                    className={`px-3 py-1 text-xs rounded-lg border transition-all cursor-pointer ${
                      activeModalItem.status === st
                        ? 'bg-stone-900 text-white border-stone-900 font-bold'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {st === 'new' ? 'جدید' : st === 'followup_needed' ? 'نیازمند اقدام' : st === 'resolved' ? 'اقدام شد' : 'بررسی شده'}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  یادداشت داخلی مدیر زائرخانه:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={activeModalItem.adminNotes || ''}
                    placeholder="مثال: با تاسیسات هماهنگ شد / تشکر پیامکی ارسال شد..."
                    onBlur={(e) => handleStatusChange(activeModalItem.id, activeModalItem.status, e.target.value)}
                    className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal Close */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex justify-end">
              <button
                onClick={() => {
                  setActiveModalItem(null);
                  if (onCloseModal) onCloseModal();
                }}
                className="px-5 py-2 text-xs font-bold bg-stone-900 hover:bg-stone-800 text-white rounded-xl cursor-pointer"
              >
                بستن پنجره
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
