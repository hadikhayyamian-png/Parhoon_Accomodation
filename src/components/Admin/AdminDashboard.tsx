import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Star, 
  ThumbsUp, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingUp, 
  Sparkles,
  MessageSquare,
  ShieldCheck,
  ChevronLeft,
  Calendar,
  Layers,
  HeartHandshake
} from 'lucide-react';
import { Accommodation, FeedbackSubmission } from '../../types';
import { calculateMetrics } from '../../utils/storage';
import { INITIAL_ACCOMMODATIONS } from '../../data/initialData';
import { ChangePasswordSection } from './ChangePasswordSection';

interface AdminDashboardProps {
  accommodations: Accommodation[];
  submissions: FeedbackSubmission[];
  onSelectPropertyFilter?: (propertyId: string) => void;
  onViewSubmissionDetail: (submission: FeedbackSubmission) => void;
  onNavigateToTab: (tab: any) => void;
  onLogoutAdmin?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  accommodations = [],
  submissions = [],
  onViewSubmissionDetail,
  onNavigateToTab,
  onLogoutAdmin
}) => {
  const safeAccommodations = accommodations.length > 0 ? accommodations : INITIAL_ACCOMMODATIONS;
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | '30days' | '7days'>('all');

  // Filter submissions by time if needed
  const now = new Date();
  const timeFilteredSubmissions = submissions.filter(s => {
    if (timeFilter === 'all') return true;
    const subDate = new Date(s.createdAt);
    const diffDays = (now.getTime() - subDate.getTime()) / (1000 * 3600 * 24);
    if (timeFilter === '7days') return diffDays <= 7;
    if (timeFilter === '30days') return diffDays <= 30;
    return true;
  });

  // Calculate metrics for selected property
  const metrics = calculateMetrics(selectedPropertyId, timeFilteredSubmissions);

  // Property comparison stats
  const prop408Metrics = calculateMetrics('mashhad-408', timeFilteredSubmissions);
  const prop409Metrics = calculateMetrics('mashhad-409', timeFilteredSubmissions);

  const selectedAcc = safeAccommodations.find(a => a.id === selectedPropertyId);

  // Category labels and icons
  const categoryMeta: Record<string, { label: string; icon: string; target: number }> = {
    cleanliness: { label: 'بهداشت و نظافت واحدها', icon: '✨', target: 4.8 },
    staff: { label: 'برخورد و تکریم پرسنل', icon: '🤝', target: 4.9 },
    comfort: { label: 'تهویه، سرمایش/گرمایش و خواب', icon: '🛏️', target: 4.5 },
    facilities: { label: 'تجهیزات و وسایل پخت‌وپز', icon: '🍳', target: 4.5 },
    location: { label: 'دسترسی و نزدیکی به حرم', icon: '🕌', target: 4.7 },
  };

  const recentList = selectedPropertyId === 'all'
    ? timeFilteredSubmissions.slice(0, 5)
    : timeFilteredSubmissions.filter(s => s.propertyId === selectedPropertyId).slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Control Zone */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <span>پنل نظارتی پرهون طرح</span>
            <span aria-hidden="true">·</span>
            <span>مشهد مقدس</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              بروزرسانی برخط (Real-Time)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            داشبورد تحلیلی و پایش بازخورد زائرخانه‌ها
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            گزارش عملکرد و تحلیل تجمیعی نظرات زائران ثبت‌شده از طریق اسکن کیوآرکد در اتاق‌ها
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Property Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-300 rounded-xl p-1">
            <Building2 className="w-4 h-4 text-stone-500 mr-2" />
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="text-xs font-semibold text-stone-800 bg-transparent py-1.5 pl-2 focus:outline-none cursor-pointer"
            >
              <option value="all">همه زائرخانه‌ها (تجمیعی)</option>
              {safeAccommodations.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time Segmented Control */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                timeFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              کل دوره
            </button>
            <button
              onClick={() => setTimeFilter('30days')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                timeFilter === '30days' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ۳۰ روز اخیر
            </button>
            <button
              onClick={() => setTimeFilter('7days')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                timeFilter === '7days' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              ۷ روز اخیر
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards (Single-Elevation, Tabular figures) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Submissions */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">کل نظرسنجی‌های ثبت‌شده</span>
            <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums">
              {metrics.totalFeedbacks}
            </span>
            <span className="text-xs text-stone-500">نفر مهمان</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-2 flex items-center gap-1">
            <span>درصد مسافران بار اولی:</span>
            <span className="font-semibold text-stone-800 font-mono tabular-nums">{metrics.firstTimeGuestsRate}٪</span>
          </div>
        </div>

        {/* Overall Satisfaction */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">میانگین شاخص رضایت</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums">
              {metrics.averageRating > 0 ? metrics.averageRating : '۰'}
            </span>
            <span className="text-xs text-stone-500">از ۵٫۰ ستاره</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-2 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>سطح کیفی: مطلوب و عالی</span>
          </div>
        </div>

        {/* Recommendation Rate (NPS) */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">شاخص وفاداری و پیشنهاد (NPS)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <ThumbsUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums">
              {metrics.recommendationRate}٪
            </span>
            <span className="text-xs text-stone-500">پاسخ مثبت</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            پیشنهاد اقامت به سایر همکاران
          </div>
        </div>

        {/* Pending Followups */}
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">نظرات نیازمند بررسی</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-700">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-stone-900 tabular-nums">
              {metrics.pendingFollowups}
            </span>
            <span className="text-xs text-stone-500">مورد باز</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-2">
            شامل پیشنهادات یا گزارش خرابی
          </div>
        </div>

      </div>

      {/* Comparison Grid: 408 vs 409 Side by Side (Highlighted for the prompt requirement) */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
        <div className="border-b border-stone-100 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>مقایسه تحلیلی عملکرد زائرخانه‌های پرهون طرح</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              تفکیک شاخص‌های کیفی بین زائرخانه ۴۰۸ مشهد و زائرخانه ۴۰۹ مشهد
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('accommodations')}
            className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
          >
            <span>مدیریت زائرخانه‌ها</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 408 */}
          <div className={`p-4 rounded-xl border transition-all ${
            selectedPropertyId === 'mashhad-408' ? 'border-amber-500 ring-2 ring-amber-100 bg-amber-50/20' : 'border-stone-200 bg-stone-50/40'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                  کد ۴۰۸
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">زائرخانه ۴۰۸ مشهد</h3>
                <span className="text-[11px] text-stone-500">خیابان امام رضا (ع)، کوچه حنایی</span>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                  {prop408Metrics.averageRating > 0 ? prop408Metrics.averageRating : '۰'}
                </div>
                <span className="text-[10px] text-stone-500">میانگین امتیاز</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-white rounded-lg border border-stone-200/80 mb-3">
              <div>
                <div className="text-[10px] text-stone-500">تعداد نظرات</div>
                <div className="font-bold font-mono text-stone-800 tabular-nums mt-0.5">{prop408Metrics.totalFeedbacks}</div>
              </div>
              <div>
                <div className="text-[10px] text-stone-500">نرخ پیشنهاد</div>
                <div className="font-bold font-mono text-stone-800 tabular-nums mt-0.5">{prop408Metrics.recommendationRate}٪</div>
              </div>
              <div>
                <div className="text-[10px] text-stone-500">پیگیری باز</div>
                <div className="font-bold font-mono text-amber-700 tabular-nums mt-0.5">{prop408Metrics.pendingFollowups}</div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPropertyId('mashhad-408')}
              className="w-full py-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              مشاهده گزارش کامل زائرخانه ۴۰۸
            </button>
          </div>

          {/* Card 409 */}
          <div className={`p-4 rounded-xl border transition-all ${
            selectedPropertyId === 'mashhad-409' ? 'border-amber-500 ring-2 ring-amber-100 bg-amber-50/20' : 'border-stone-200 bg-stone-50/40'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                  کد ۴۰۹
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">زائرخانه ۴۰۹ مشهد</h3>
                <span className="text-[11px] text-stone-500">خیابان آیت‌الله بهجت، بهجت ۷</span>
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold font-mono text-stone-900 tabular-nums">
                  {prop409Metrics.averageRating > 0 ? prop409Metrics.averageRating : '۰'}
                </div>
                <span className="text-[10px] text-stone-500">میانگین امتیاز</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-white rounded-lg border border-stone-200/80 mb-3">
              <div>
                <div className="text-[10px] text-stone-500">تعداد نظرات</div>
                <div className="font-bold font-mono text-stone-800 tabular-nums mt-0.5">{prop409Metrics.totalFeedbacks}</div>
              </div>
              <div>
                <div className="text-[10px] text-stone-500">نرخ پیشنهاد</div>
                <div className="font-bold font-mono text-stone-800 tabular-nums mt-0.5">{prop409Metrics.recommendationRate}٪</div>
              </div>
              <div>
                <div className="text-[10px] text-stone-500">پیگیری باز</div>
                <div className="font-bold font-mono text-amber-700 tabular-nums mt-0.5">{prop409Metrics.pendingFollowups}</div>
              </div>
            </div>

            <button
              onClick={() => setSelectedPropertyId('mashhad-409')}
              className="w-full py-1.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              مشاهده گزارش کامل زائرخانه ۴۰۹
            </button>
          </div>

        </div>
      </div>

      {/* Two Column Section: Category Breakdown + Star Rating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Category Breakdown Bars */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
          <div className="border-b border-stone-100 pb-3 mb-4">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>تحلیل کیفی به تفکیک حوزه‌های اقامتی</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              میانگین نمرات ۵ ستاره برای {selectedAcc ? selectedAcc.name : 'همه واحدها'}
            </p>
          </div>

          <div className="space-y-4">
            {Object.keys(categoryMeta).map(catKey => {
              const meta = categoryMeta[catKey];
              const score = metrics.categoryAverages[catKey] || 0;
              const percentage = Math.min(100, Math.round((score / 5) * 100));

              return (
                <div key={catKey}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-stone-800 flex items-center gap-1.5">
                      <span>{meta.icon}</span>
                      <span>{meta.label}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-stone-900 tabular-nums">
                        {score > 0 ? `${score} / ۵` : 'بدون داده'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress track */}
                  <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        score >= 4.5 ? 'bg-emerald-500' : score >= 3.5 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Star Rating Distribution */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
          <div className="border-b border-stone-100 pb-3 mb-4">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>توزیع آماری رضایتمندی (Star Distribution)</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              تعداد و درصد آراء ثبت‌شده در بازه‌های ۱ تا ۵ ستاره
            </p>
          </div>

          <div className="space-y-3">
            {metrics.ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-3 text-xs">
                <div className="w-16 flex items-center gap-1 font-semibold text-stone-700 shrink-0">
                  <span className="font-mono tabular-nums">{item.stars}</span>
                  <span>ستاره</span>
                </div>

                <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <div className="w-20 text-left font-mono tabular-nums text-stone-500 shrink-0">
                  <span className="font-bold text-stone-800">{item.count}</span>
                  <span className="text-[10px] mr-1">({item.percentage}٪)</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Summary Note */}
          <div className="mt-6 pt-4 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
            <span>مجموع آراء معتبر: <strong className="text-stone-800 font-mono tabular-nums">{metrics.totalFeedbacks}</strong></span>
            <span className="text-emerald-700 font-semibold">بیش از ۸۵٪ رضایت حداکثری</span>
          </div>
        </div>

      </div>

      {/* Recent Submissions Feed */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
        <div className="border-b border-stone-100 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-stone-700" />
              <span>آخرین بازخوردهای ثبت شده مهمانان</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              مشاهده اطلاعات فردی، اتاق و پیشنهادات ورودی اخیر
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab('responses')}
            className="text-xs font-semibold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
          >
            <span>مشاهده همه در جدول</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentList.length === 0 ? (
          <div className="text-center py-8 text-stone-400 text-xs">
            نظرسنجی برای این فیلتر ثبت نشده است.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {recentList.map((item) => (
              <div 
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50/70 p-2 rounded-xl transition-colors cursor-pointer"
                onClick={() => onViewSubmissionDetail(item)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center font-bold text-stone-700 text-xs shrink-0">
                    {item.guestInfo.fullName.slice(0, 1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">{item.guestInfo.fullName}</span>
                      <span className="text-[11px] text-stone-500 font-mono" dir="ltr">{item.guestInfo.mobile}</span>
                      <span className="text-[10px] bg-stone-100 text-stone-700 px-1.5 py-0.2 rounded font-medium">
                        اتاق {item.guestInfo.roomNumber}
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 mt-1 line-clamp-1">
                      {item.generalNotes || 'بدون توضیحات متنی اضافی (ثبت امتیاز ستاره‌ای)'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-right sm:text-left">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold font-mono text-stone-900 tabular-nums">
                        {item.overallRating}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400">
                      {item.propertyName.replace('مشهد', '')}
                    </span>
                  </div>

                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    item.status === 'new' 
                      ? 'bg-amber-100 text-amber-800' 
                      : item.status === 'followup_needed'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.status === 'new' ? 'جدید' : item.status === 'followup_needed' ? 'اقدام' : 'بررسی شد'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Password & Security Management */}
      <ChangePasswordSection onLogoutAdmin={onLogoutAdmin} />

    </div>
  );
};
