import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { ResponsesTable } from './components/Admin/ResponsesTable';
import { QuestionnaireManager } from './components/Admin/QuestionnaireManager';
import { AccommodationManager } from './components/Admin/AccommodationManager';
import { GuestSurveyFlow } from './components/GuestForm/GuestSurveyFlow';
import { AdminLoginModal } from './components/Admin/AdminLoginModal';
import { Accommodation, Question, FeedbackSubmission } from './types';
import { getAccommodations, getQuestions, getSubmissions } from './utils/storage';
import { 
  getIsAdminAuthenticated, 
  setAdminAuthenticatedSession,
  CREATOR_MASTER_PASSWORD
} from './utils/auth';
import { 
  Sparkles, 
  QrCode, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Smartphone,
  LogOut,
  ShieldAlert
} from 'lucide-react';

export default function App() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>(() => getAccommodations());
  const [questions, setQuestions] = useState<Question[]>(() => getQuestions());
  const [submissions, setSubmissions] = useState<FeedbackSubmission[]>(() => getSubmissions());
  
  // Default to guest-form so visitors scanning QR on phone directly get the survey form
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'responses' | 'questionnaire' | 'accommodations' | 'guest-form'>('guest-form');
  const [guestSurveyPropertyId, setGuestSurveyPropertyId] = useState<string>('mashhad-408');
  const [selectedSubmissionForModal, setSelectedSubmissionForModal] = useState<FeedbackSubmission | null>(null);

  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => getIsAdminAuthenticated());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [targetAdminTab, setTargetAdminTab] = useState<'dashboard' | 'responses' | 'questionnaire' | 'accommodations'>('dashboard');

  // Load initial state & check query params
  useEffect(() => {
    const accs = getAccommodations();
    const qs = getQuestions();
    const subs = getSubmissions();
    const isAuth = getIsAdminAuthenticated();

    setAccommodations(accs);
    setQuestions(qs);
    setSubmissions(subs);
    setIsAdminAuthenticated(isAuth);

    // Check if opened via QR code URL parameter e.g. ?property=mashhad-408 or ?tab=...
    const searchParams = new URLSearchParams(window.location.search);
    const propParam = searchParams.get('property');
    const tabParam = searchParams.get('tab');

    if (propParam) {
      const match = accs.find(a => a.id === propParam || a.code === propParam);
      if (match) {
        setGuestSurveyPropertyId(match.id);
      }
      setCurrentTab('guest-form');
    } else if (tabParam === 'admin') {
      if (isAuth) {
        setCurrentTab('dashboard');
      } else {
        setTargetAdminTab('dashboard');
        setIsLoginModalOpen(true);
      }
    }
  }, []);

  const refreshData = () => {
    setAccommodations(getAccommodations());
    setQuestions(getQuestions());
    setSubmissions(getSubmissions());
  };

  const handleTabChange = (tab: 'dashboard' | 'responses' | 'questionnaire' | 'accommodations' | 'guest-form') => {
    if (tab === 'guest-form') {
      setCurrentTab('guest-form');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Admin tab requested
    if (isAdminAuthenticated) {
      setCurrentTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setTargetAdminTab(tab);
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    setAdminAuthenticatedSession(true);
    setIsLoginModalOpen(false);
    setCurrentTab(targetAdminTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsAdminAuthenticated(false);
    setAdminAuthenticatedSession(false);
    setCurrentTab('guest-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSimulateScan = (propertyId: string) => {
    setGuestSurveyPropertyId(propertyId);
    setCurrentTab('guest-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmissionComplete = (newSub: FeedbackSubmission) => {
    refreshData();
  };

  const handleViewSubmissionDetail = (sub: FeedbackSubmission) => {
    setSelectedSubmissionForModal(sub);
    setCurrentTab('responses');
  };

  const pendingCount = submissions.filter(s => s.status === 'new' || s.status === 'followup_needed').length;

  const tabLabels: Record<string, string> = {
    dashboard: 'داشبورد تحلیلی',
    responses: 'جدول نظرات مهمانان',
    questionnaire: 'مدیریت پرسشنامه‌ها',
    accommodations: 'زائرخانه‌ها و کد QR'
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900" dir="rtl">
      
      <div>
        {/* Header navigation with Lock Status & Logout */}
        <Header 
          currentTab={currentTab} 
          onTabChange={handleTabChange}
          pendingCount={pendingCount}
          isAdminAuthenticated={isAdminAuthenticated}
          onLogoutAdmin={handleLogout}
        />

        {/* Top Context Indicator Banner */}
        <div className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
          <div className="bg-amber-500/10 border border-amber-300/40 rounded-xl px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-amber-950 font-medium">
              <span className={`w-2.5 h-2.5 rounded-full ${isAdminAuthenticated ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
              <span>
                {currentTab === 'guest-form' ? (
                  <>
                    صفحه ورود مهمان از طریق اسکن بارکد QR در زائرخانه · <strong className="font-bold">دسترسی عمومی</strong>
                  </>
                ) : (
                  <>
                    پنل اختصاصی مدیریت پرهون طرح · <strong className="text-emerald-800 font-bold">ورود احراز هویت شده ادمین</strong>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentTab === 'guest-form' ? (
                <button
                  onClick={() => handleTabChange('dashboard')}
                  className="px-3 py-1 font-bold text-stone-900 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>ورود مدیر با رمز عبور</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setGuestSurveyPropertyId(accommodations[0]?.id || 'mashhad-408');
                      setCurrentTab('guest-form');
                    }}
                    className="px-3 py-1 font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg shadow-2xs cursor-pointer flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>مشاهده نمای مسافر (اسکن بارکد)</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100/80 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    title="قفل کردن پنل مدیریت"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>قفل پنل</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Guest Form (Default visitor landing upon scanning QR code) */}
          {currentTab === 'guest-form' && (
            <GuestSurveyFlow
              accommodations={accommodations}
              questions={questions}
              initialAccommodationId={guestSurveyPropertyId}
              onSubmissionComplete={handleSubmissionComplete}
              onSwitchToAdmin={() => handleTabChange('dashboard')}
            />
          )}

          {/* Admin Protected Views */}
          {isAdminAuthenticated && currentTab === 'dashboard' && (
            <AdminDashboard 
              accommodations={accommodations}
              submissions={submissions}
              onViewSubmissionDetail={handleViewSubmissionDetail}
              onNavigateToTab={(tab) => handleTabChange(tab)}
              onLogoutAdmin={handleLogout}
            />
          )}

          {isAdminAuthenticated && currentTab === 'responses' && (
            <ResponsesTable
              submissions={submissions}
              accommodations={accommodations}
              questions={questions}
              onSubmissionUpdated={refreshData}
              selectedSubmissionForModal={selectedSubmissionForModal}
              onCloseModal={() => setSelectedSubmissionForModal(null)}
            />
          )}

          {isAdminAuthenticated && currentTab === 'questionnaire' && (
            <QuestionnaireManager
              questions={questions}
              accommodations={accommodations}
              onQuestionsChange={refreshData}
            />
          )}

          {isAdminAuthenticated && currentTab === 'accommodations' && (
            <AccommodationManager
              accommodations={accommodations}
              submissions={submissions}
              onAccommodationsChange={refreshData}
              onSimulateScan={handleSimulateScan}
            />
          )}

        </main>
      </div>

      {/* Admin Login Modal (Password required + creator master key 'parhoon' recovery) */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
        targetTabName={tabLabels[targetAdminTab] || 'پنل مدیریت'}
      />

      {/* Footer */}
      <footer className="no-print bg-white border-t border-stone-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900">شرکت پرهون طرح</span>
            <span aria-hidden="true">·</span>
            <span>سامانه ثبت نظرات اقامت در زائرخانه‌های ۴۰۸ و ۴۰۹ مشهد مقدس</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentTab('guest-form')} 
              className="hover:text-stone-900 transition-colors"
            >
              فرم ثبت نظر مسافر
            </button>
            <span aria-hidden="true">·</span>
            <button 
              onClick={() => handleTabChange('dashboard')} 
              className="hover:text-stone-900 transition-colors flex items-center gap-1 font-medium"
            >
              <Lock className="w-3 h-3 text-amber-600" />
              <span>ورود مدیریت</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
