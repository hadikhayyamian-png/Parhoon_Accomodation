import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Users, 
  History, 
  Briefcase, 
  Star, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Send, 
  Sparkles,
  QrCode,
  ShieldCheck,
  DoorClosed,
  Copy,
  Check
} from 'lucide-react';
import { Accommodation, Question, GuestContactInfo, FeedbackSubmission } from '../../types';
import { addSubmission } from '../../utils/storage';
import { INITIAL_ACCOMMODATIONS } from '../../data/initialData';

interface GuestSurveyFlowProps {
  accommodations: Accommodation[];
  questions: Question[];
  initialAccommodationId?: string;
  onSubmissionComplete: (submission: FeedbackSubmission) => void;
  onSwitchToAdmin: () => void;
}

export const GuestSurveyFlow: React.FC<GuestSurveyFlowProps> = ({
  accommodations = [],
  questions = [],
  initialAccommodationId,
  onSubmissionComplete,
  onSwitchToAdmin,
}) => {
  // Use passed accommodations or fallback to INITIAL_ACCOMMODATIONS
  const safeAccommodations = accommodations.length > 0 ? accommodations : INITIAL_ACCOMMODATIONS;

  // Selected accommodation
  const [selectedAccId, setSelectedAccId] = useState<string>(
    initialAccommodationId || safeAccommodations[0]?.id || 'mashhad-408'
  );

  // Sync selectedAccId if initialAccommodationId changes
  useEffect(() => {
    if (initialAccommodationId) {
      setSelectedAccId(initialAccommodationId);
    }
  }, [initialAccommodationId]);

  // Stepper: 1: Contact & History (hardcoded), 2: Questionnaire (admin managed), 3: Success
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Hardcoded Guest Contact & History Info Form
  const [guestInfo, setGuestInfo] = useState<GuestContactInfo>({
    fullName: '',
    mobile: '',
    nationalId: '',
    originCity: '',
    roomNumber: '',
    checkInDate: new Date().toLocaleDateString('fa-IR'),
    checkOutDate: '',
    stayDurationDays: 3,
    stayHistory: 'first_time',
    guestCount: 2,
    affiliation: 'personnel'
  });

  // Questionnaire Answers: questionId -> value
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submittedData, setSubmittedData] = useState<FeedbackSubmission | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedCode, setCopiedCode] = useState(false);

  // Active accommodation object with safe fallbacks
  const currentAcc = safeAccommodations.find(a => a.id === selectedAccId) 
    || safeAccommodations[0] 
    || INITIAL_ACCOMMODATIONS[0];

  // Active questions for this accommodation
  const propertyQuestions = questions
    .filter(q => q.propertyId === 'all' || q.propertyId === selectedAccId)
    .sort((a, b) => a.order - b.order);

  // Validate Step 1 (Contact info & History)
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!guestInfo.fullName.trim()) errs.fullName = 'لطفاً نام و نام خانوادگی را وارد کنید';
    if (!guestInfo.mobile.trim()) {
      errs.mobile = 'لطفاً شماره تلفن همراه را وارد کنید';
    } else if (!/^09\d{9}$/.test(guestInfo.mobile.replace(/\s+/g, ''))) {
      errs.mobile = 'شماره موبایل باید با ۰۹ شروع شده و ۱۱ رقم باشد';
    }
    if (!guestInfo.originCity.trim()) errs.originCity = 'لطفاً شهر مبدا را مشخص کنید';
    if (!guestInfo.roomNumber.trim()) errs.roomNumber = 'لطفاً شماره اتاق/سوئیت را وارد کنید';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Validate Step 2 (Questionnaire)
  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    propertyQuestions.forEach(q => {
      if (q.required) {
        const ans = answers[q.id];
        if (ans === undefined || ans === null || ans === '') {
          errs[q.id] = 'پاسخ به این سوال الزامی است';
        }
      }
    });

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextToQuestions = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setStep(2);
    }
  };

  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) {
      return;
    }

    // Calculate overall average rating from 5-star questions
    let ratingSum = 0;
    let ratingCount = 0;
    propertyQuestions.forEach(q => {
      if (q.type === 'rating_5' && typeof answers[q.id] === 'number') {
        ratingSum += answers[q.id];
        ratingCount++;
      }
    });
    const calculatedOverall = ratingCount > 0 ? Number((ratingSum / ratingCount).toFixed(1)) : 5;

    // Find recommendation choice or text notes
    const recQuestion = propertyQuestions.find(q => q.title.includes('پیشنهاد'));
    const recChoice = recQuestion ? answers[recQuestion.id] : undefined;

    const textQuestion = propertyQuestions.find(q => q.type === 'text');
    const generalNotes = textQuestion ? answers[textQuestion.id] : undefined;

    const newSubmission = addSubmission({
      propertyId: currentAcc?.id || 'mashhad-408',
      propertyName: currentAcc?.name || 'زائرخانه پرهون طرح',
      guestInfo: { ...guestInfo },
      answers: { ...answers },
      overallRating: calculatedOverall,
      recommendationChoice: typeof recChoice === 'string' ? recChoice : undefined,
      generalNotes: typeof generalNotes === 'string' ? generalNotes : undefined,
    });

    setSubmittedData(newSubmission);
    onSubmissionComplete(newSubmission);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleResetForm = () => {
    setGuestInfo({
      fullName: '',
      mobile: '',
      nationalId: '',
      originCity: '',
      roomNumber: '',
      checkInDate: new Date().toLocaleDateString('fa-IR'),
      checkOutDate: '',
      stayDurationDays: 3,
      stayHistory: 'first_time',
      guestCount: 2,
      affiliation: 'personnel'
    });
    setAnswers({});
    setErrors({});
    setSubmittedData(null);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyTrackingCode = () => {
    if (submittedData?.trackingCode) {
      navigator.clipboard.writeText(submittedData.trackingCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const starLabels: Record<number, string> = {
    5: 'بسیار عالی',
    4: 'خوب و رضایت‌بخش',
    3: 'متوسط و معمولی',
    2: 'ضعیف و نیازمند توجه',
    1: 'بسیار ضعیف و ناراضی'
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-10">
      
      {/* Accommodation Selector Banner (Simulating QR scan landing) */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                  اسکن موفق کد QR
                </span>
                <span className="text-xs text-stone-500">
                  شرکت پرهون طرح
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-stone-900 mt-1">
                نظرسنجی اقامت در {currentAcc?.name || 'زائرخانه پرهون طرح'}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                {currentAcc?.address || ''}
              </p>
            </div>
          </div>

          {/* Quick Switch for Testing other QR codes */}
          <div className="sm:self-center border-t sm:border-t-0 sm:border-r border-stone-200 pt-3 sm:pt-0 sm:pr-4">
            <label className="block text-[11px] font-medium text-stone-500 mb-1">
              تغییر زائرخانه (شبیه‌سازی اسکن):
            </label>
            <select
              value={selectedAccId}
              onChange={(e) => {
                setSelectedAccId(e.target.value);
                setAnswers({});
              }}
              disabled={step === 3}
              className="w-full sm:w-auto text-xs font-semibold bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {safeAccommodations.map(acc => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      {step !== 3 && (
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-200 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 right-0 h-0.5 bg-amber-600 -translate-y-1/2 z-0 transition-all duration-300"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />

            {/* Step 1 Mark */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 1 ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-200 text-stone-600'
              }`}>
                ۱
              </div>
              <span className="text-xs font-semibold text-stone-800 mt-1.5 whitespace-nowrap">
                مشخصات و سوابق مهمان
              </span>
            </div>

            {/* Step 2 Mark */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= 2 ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-200 text-stone-600'
              }`}>
                ۲
              </div>
              <span className={`text-xs font-semibold mt-1.5 whitespace-nowrap ${
                step >= 2 ? 'text-stone-800' : 'text-stone-400'
              }`}>
                پرسشنامه ارزیابی اقامت
              </span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: General & Contact Information Form (HARD CODED) */}
      {step === 1 && (
        <form onSubmit={handleNextToQuestions} className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-8 shadow-xs">
          
          <div className="border-b border-stone-100 pb-4 mb-6">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-600" />
              <span>مرحله اول: مشخصات عمومی و سوابق اقامت مهمان</span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              اطلاعات تماس شما نزد شرکت پرهون طرح محفوظ بوده و صرفاً جهت پیگیری امور رفاهی و ارتقای خدمات زائرخانه‌ها استفاده خواهد شد.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                نام و نام خانوادگی سرپرست <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثال: رضا محمدی"
                  value={guestInfo.fullName}
                  onChange={(e) => setGuestInfo({ ...guestInfo, fullName: e.target.value })}
                  className={`w-full text-sm bg-stone-50 border rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                    errors.fullName ? 'border-rose-400 ring-1 ring-rose-200' : 'border-stone-300'
                  }`}
                />
              </div>
              {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                شماره تلفن همراه <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="09123456789"
                  value={guestInfo.mobile}
                  onChange={(e) => setGuestInfo({ ...guestInfo, mobile: e.target.value })}
                  className={`w-full text-sm text-right bg-stone-50 border rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                    errors.mobile ? 'border-rose-400 ring-1 ring-rose-200' : 'border-stone-300'
                  }`}
                />
              </div>
              {errors.mobile && <p className="text-[11px] text-rose-500 mt-1">{errors.mobile}</p>}
            </div>

            {/* National ID */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                کد ملی (اختیاری)
              </label>
              <input
                type="text"
                dir="ltr"
                placeholder="0012345678"
                value={guestInfo.nationalId || ''}
                onChange={(e) => setGuestInfo({ ...guestInfo, nationalId: e.target.value })}
                className="w-full text-sm text-right bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Origin City */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                شهر مبدأ مسافرت <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="مثال: تهران، اصفهان، تبریز، شیراز..."
                value={guestInfo.originCity}
                onChange={(e) => setGuestInfo({ ...guestInfo, originCity: e.target.value })}
                className={`w-full text-sm bg-stone-50 border rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                  errors.originCity ? 'border-rose-400 ring-1 ring-rose-200' : 'border-stone-300'
                }`}
              />
              {errors.originCity && <p className="text-[11px] text-rose-500 mt-1">{errors.originCity}</p>}
            </div>

            {/* Room Number */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                شماره اتاق / سوئیت <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثال: ۱۰۴ یا سوئیت ۳۰۲"
                  value={guestInfo.roomNumber}
                  onChange={(e) => setGuestInfo({ ...guestInfo, roomNumber: e.target.value })}
                  className={`w-full text-sm bg-stone-50 border rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                    errors.roomNumber ? 'border-rose-400 ring-1 ring-rose-200' : 'border-stone-300'
                  }`}
                />
              </div>
              {errors.roomNumber && <p className="text-[11px] text-rose-500 mt-1">{errors.roomNumber}</p>}
            </div>

            {/* Affiliation */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                نوع ارتباط با شرکت پرهون طرح
              </label>
              <select
                value={guestInfo.affiliation}
                onChange={(e) => setGuestInfo({ ...guestInfo, affiliation: e.target.value as any })}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="personnel">پرسنل شرکت پرهون طرح</option>
                <option value="family">خانواده درجه یک همکاران</option>
                <option value="corporate_guest">مهمان سازمانی و شرکای تجاری</option>
                <option value="other">سایر مهمانان محترم</option>
              </select>
            </div>

            {/* Stay History */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-800 mb-2">
                سابقه اقامت در زائرخانه‌های پرهون طرح <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { value: 'first_time', label: 'اولین بار است', desc: 'نخستین تجربه اقامت' },
                  { value: '2_to_3_times', label: '۲ الی ۳ بار', desc: 'سابقه اقامت قبلی' },
                  { value: 'more_than_3', label: 'بیش از ۳ بار', desc: 'مهمان وفادار' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setGuestInfo({ ...guestInfo, stayHistory: item.value as any })}
                    className={`p-3 rounded-xl border text-right transition-all cursor-pointer ${
                      guestInfo.stayHistory === item.value
                        ? 'border-amber-600 bg-amber-50/70 text-stone-900 shadow-xs'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Guest Count */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                تعداد همراهان (نفر)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuestInfo({ ...guestInfo, guestCount: num })}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      guestInfo.guestCount === num
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {num === 6 ? '+۶' : num}
                  </button>
                ))}
              </div>
            </div>

            {/* Check-in Date */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                تاریخ تقریبی اقامت
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="ورود: مثال ۱۴۰۴/۰۱/۱۵"
                  value={guestInfo.checkInDate}
                  onChange={(e) => setGuestInfo({ ...guestInfo, checkInDate: e.target.value })}
                  className="w-1/2 text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-center"
                />
                <input
                  type="text"
                  placeholder="خروج: مثال ۱۴۰۴/۰۱/۱۹"
                  value={guestInfo.checkOutDate}
                  onChange={(e) => setGuestInfo({ ...guestInfo, checkOutDate: e.target.value })}
                  className="w-1/2 text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-center"
                />
              </div>
            </div>

          </div>

          {/* Action button */}
          <div className="mt-8 pt-6 border-t border-stone-200 flex items-center justify-between">
            <div className="text-xs text-stone-500">
              مرحله ۱ از ۲: مشخصات تماس
            </div>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <span>ورود به پرسشنامه زائرخانه</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

        </form>
      )}

      {/* STEP 2: Questionnaire Form (ADMIN CONFIGURABLE) */}
      {step === 2 && (
        <form onSubmit={handleSubmitSurvey} className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-8 shadow-xs">
          
          <div className="border-b border-stone-100 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span>مرحله دوم: پرسشنامه ارزیابی دوره اقامت</span>
              </h2>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
              >
                <span>ویرایش مشخصات</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              پرسشنامه زیر توسط مدیریت شرکت پرهون طرح برای «{currentAcc?.name || 'زائرخانه‌های پرهون طرح'}» طراحی شده است. لطفاً صادقانه امتیاز دهید.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {propertyQuestions.map((q, idx) => {
              const currentVal = answers[q.id];
              const hasError = !!errors[q.id];

              return (
                <div 
                  key={q.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    hasError ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200 bg-stone-50/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-700 tabular-nums">
                          سوال {idx + 1}.
                        </span>
                        <h3 className="text-sm font-bold text-stone-900">
                          {q.title}
                        </h3>
                        {q.required && <span className="text-rose-500 text-xs">*</span>}
                      </div>
                      {q.description && (
                        <p className="text-xs text-stone-500 mt-1 mr-5">
                          {q.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Render based on Question Type */}
                  
                  {/* 1. 5-STAR RATING */}
                  {q.type === 'rating_5' && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 sm:gap-3 flex-row-reverse justify-end">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const isSelected = currentVal >= rating;
                          return (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => {
                                setAnswers({ ...answers, [q.id]: rating });
                                if (errors[q.id]) {
                                  const updated = { ...errors };
                                  delete updated[q.id];
                                  setErrors(updated);
                                }
                              }}
                              className="group p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                              title={`${rating} از ۵ ستاره`}
                            >
                              <Star
                                className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors ${
                                  isSelected
                                    ? 'text-amber-500 fill-amber-500'
                                    : 'text-stone-300 group-hover:text-amber-300'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>

                      {/* Descriptive Label */}
                      <div className="mt-2 text-xs font-medium text-stone-600">
                        {currentVal ? (
                          <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            امتیاز شما: {starLabels[currentVal]} ({currentVal} از ۵)
                          </span>
                        ) : (
                          <span className="text-stone-400">
                            لطفاً با انتخاب ستاره‌ها امتیاز دهید
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 2. CHOICE SINGLE */}
                  {q.type === 'choice_single' && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setAnswers({ ...answers, [q.id]: opt });
                            if (errors[q.id]) {
                              const updated = { ...errors };
                              delete updated[q.id];
                              setErrors(updated);
                            }
                          }}
                          className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                            currentVal === opt
                              ? 'border-amber-600 bg-white text-stone-900 shadow-xs'
                              : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <span className="text-xs font-semibold">{opt}</span>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            currentVal === opt ? 'border-amber-600 bg-amber-600 text-white' : 'border-stone-300'
                          }`}>
                            {currentVal === opt && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 3. TEXT AREA */}
                  {q.type === 'text' && (
                    <div className="mt-3">
                      <textarea
                        rows={3}
                        placeholder="نظرات، پیشنهادات یا در صورت نیاز به تعمیر وسیله‌ای در اتاق، اینجا بنویسید..."
                        value={currentVal || ''}
                        onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                        className="w-full text-xs sm:text-sm bg-white border border-stone-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  )}

                  {/* 4. YES / NO */}
                  {q.type === 'yes_no' && (
                    <div className="flex items-center gap-3 mt-3">
                      {['بله', 'خیر'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAnswers({ ...answers, [q.id]: val })}
                          className={`px-5 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            currentVal === val
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}

                  {hasError && (
                    <p className="text-[11px] text-rose-500 mt-2 font-medium">
                      {errors[q.id]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="mt-8 pt-6 border-t border-stone-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl transition-all cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>بازگشت به مشخصات</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>ثبت نهایی نظرسنجی</span>
            </button>
          </div>

        </form>
      )}

      {/* STEP 3: Success Confirmation & Tracking Code */}
      {step === 3 && submittedData && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 shadow-xs text-center">
          
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full">
            نظرسنجی با موفقیت ثبت شد
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-stone-900 mt-3">
            زیارت شما قبول درگاه حق تعالی
          </h2>

          <p className="text-sm text-stone-600 max-w-lg mx-auto mt-2 leading-relaxed">
            زائر گرامی، جناب آقای/سرکار خانم <strong className="text-stone-900 font-bold">{submittedData.guestInfo.fullName}</strong>؛
            از اینکه وقت ارزشمند خود را در طول اقامت در <strong className="text-stone-900">{submittedData.propertyName}</strong> صرف ثبت دیدگاه نمودید، از طرف مدیریت شرکت پرهون طرح کمال امتنان را داریم.
          </p>

          {/* Tracking Code Box */}
          <div className="my-6 max-w-sm mx-auto bg-stone-50 border border-stone-200 rounded-xl p-4">
            <span className="text-xs text-stone-500 font-medium block">
              کد پیگیری نظرسنجی شما
            </span>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="font-mono text-xl sm:text-2xl font-black text-amber-700 tracking-wider tabular-nums" dir="ltr">
                {submittedData.trackingCode}
              </span>
              <button
                type="button"
                onClick={copyTrackingCode}
                className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-200 transition-colors"
                title="کپی کد پیگیری"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[11px] text-stone-400 mt-1 block">
              این کد در بایگانی پرهون طرح ثبت و قابل پیگیری خواهد بود.
            </span>
          </div>

          {/* Summary Details */}
          <div className="max-w-md mx-auto bg-stone-50/70 border border-stone-200 rounded-xl p-4 text-right text-xs text-stone-600 space-y-1.5 mb-8">
            <div className="flex justify-between">
              <span>اقامتگاه:</span>
              <span className="font-semibold text-stone-800">{submittedData.propertyName}</span>
            </div>
            <div className="flex justify-between">
              <span>شماره اتاق:</span>
              <span className="font-semibold text-stone-800">{submittedData.guestInfo.roomNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>میانگین امتیاز ثبت شده:</span>
              <span className="font-semibold text-amber-700">{submittedData.overallRating} از ۵ ستاره</span>
            </div>
            <div className="flex justify-between">
              <span>تاریخ ثبت:</span>
              <span className="font-mono text-stone-800">{new Date(submittedData.createdAt).toLocaleDateString('fa-IR')}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleResetForm}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all cursor-pointer"
            >
              ثبت نظر جدید یا برای همراه دیگر
            </button>

            <button
              onClick={onSwitchToAdmin}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <span>ورود به پنل مدیریت پرهون طرح (با رمز عبور)</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
