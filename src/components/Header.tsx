import React from 'react';
import { 
  Building2, 
  BarChart3, 
  MessageSquareText, 
  HelpCircle, 
  QrCode, 
  Smartphone,
  ShieldCheck,
  Lock,
  LogOut
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'dashboard' | 'responses' | 'questionnaire' | 'accommodations' | 'guest-form';
  onTabChange: (tab: 'dashboard' | 'responses' | 'questionnaire' | 'accommodations' | 'guest-form') => void;
  pendingCount?: number;
  isAdminAuthenticated?: boolean;
  onLogoutAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentTab, 
  onTabChange, 
  pendingCount = 0,
  isAdminAuthenticated = false,
  onLogoutAdmin
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Single text element Brand Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center text-amber-400 font-black text-xl shadow-xs">
              پ
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-stone-900 leading-tight">
                پرهون طرح
              </span>
              <span className="text-xs text-stone-500 font-medium">
                سامانه نظرسنجی و مدیریت زائرخانه‌ها
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation tabs with lock indicators for admin tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl">
            <button
              onClick={() => onTabChange('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-600" />
              <span>داشبورد تحلیلی</span>
              {!isAdminAuthenticated && <Lock className="w-3 h-3 text-stone-400 mr-0.5" />}
            </button>

            <button
              onClick={() => onTabChange('responses')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all relative ${
                currentTab === 'responses'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MessageSquareText className="w-4 h-4 text-emerald-600" />
              <span>نظرات مهمانان</span>
              {pendingCount > 0 && (
                <span className="tabular-nums text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                  {pendingCount}
                </span>
              )}
              {!isAdminAuthenticated && <Lock className="w-3 h-3 text-stone-400 mr-0.5" />}
            </button>

            <button
              onClick={() => onTabChange('questionnaire')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentTab === 'questionnaire'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>پرسشنامه‌ها</span>
              {!isAdminAuthenticated && <Lock className="w-3 h-3 text-stone-400 mr-0.5" />}
            </button>

            <button
              onClick={() => onTabChange('accommodations')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentTab === 'accommodations'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-stone-700" />
              <span>زائرخانه‌ها و کد QR</span>
              {!isAdminAuthenticated && <Lock className="w-3 h-3 text-stone-400 mr-0.5" />}
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={onLogoutAdmin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
                title="خروج از پنل مدیریت"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج ادمین</span>
              </button>
            )}

            <button
              onClick={() => onTabChange('guest-form')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shadow-xs ${
                currentTab === 'guest-form'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-500/20'
                  : 'bg-stone-900 hover:bg-stone-800 text-white'
              }`}
            >
              <Smartphone className="w-4 h-4 text-amber-300" />
              <span>فرم مهمان (اسکن بارکد)</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-between py-2 border-t border-stone-200 overflow-x-auto gap-2">
          <button
            onClick={() => onTabChange('guest-form')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md ${
              currentTab === 'guest-form' ? 'bg-amber-600 text-white font-medium' : 'text-stone-600'
            }`}
          >
            فرم مهمان (QR)
          </button>
          <button
            onClick={() => onTabChange('dashboard')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md flex items-center gap-1 ${
              currentTab === 'dashboard' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
            }`}
          >
            <span>داشبورد</span>
            {!isAdminAuthenticated && <Lock className="w-3 h-3 text-stone-400" />}
          </button>
          <button
            onClick={() => onTabChange('responses')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md flex items-center gap-1 ${
              currentTab === 'responses' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
            }`}
          >
            <span>نظرات ({pendingCount})</span>
            {!isAdminAuthenticated && <Lock className="w-3 h-3 text-stone-400" />}
          </button>
          <button
            onClick={() => onTabChange('questionnaire')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md flex items-center gap-1 ${
              currentTab === 'questionnaire' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
            }`}
          >
            <span>پرسشنامه‌ها</span>
            {!isAdminAuthenticated && <Lock className="w-3 h-3 text-stone-400" />}
          </button>
          <button
            onClick={() => onTabChange('accommodations')}
            className={`px-2.5 py-1 text-xs whitespace-nowrap rounded-md flex items-center gap-1 ${
              currentTab === 'accommodations' ? 'bg-stone-900 text-white font-medium' : 'text-stone-600'
            }`}
          >
            <span>QR کد</span>
            {!isAdminAuthenticated && <Lock className="w-3 h-3 text-stone-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
