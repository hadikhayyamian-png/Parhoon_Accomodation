import React, { useState } from 'react';
import { 
  Lock, 
  KeyRound, 
  ShieldAlert, 
  HelpCircle, 
  ArrowLeft, 
  Check, 
  Eye, 
  EyeOff, 
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { checkAdminPassword, setStoredAdminPassword, CREATOR_MASTER_PASSWORD } from '../../utils/auth';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  targetTabName?: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetTabName = 'پنل مدیریت'
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isForgotMode, setIsForgotMode] = useState(false);

  // Forgot password reset flow state
  const [masterKeyInput, setMasterKeyInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = checkAdminPassword(password);
    if (result.success) {
      setPassword('');
      setError(null);
      onSuccess();
    } else {
      setError('رمز عبور وارد شده نادرست است. در صورت فراموشی، گزینه «فراموشی رمز عبور» را انتخاب فرمایید.');
    }
  };

  const handleMasterReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (masterKeyInput.trim() !== CREATOR_MASTER_PASSWORD) {
      setError('رمز سازنده (Creator Password) معتبر نیست.');
      return;
    }

    if (newPasswordInput.length < 4) {
      setError('رمز عبور جدید باید حداقل ۴ کاراکتر باشد.');
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setError('تکرار رمز عبور جدید با آن همخوانی ندارد.');
      return;
    }

    setStoredAdminPassword(newPasswordInput.trim());
    setResetSuccessMessage('رمز عبور جدید با موفقیت تنظیم شد. اکنون می‌توانید وارد شوید.');
    setIsForgotMode(false);
    setPassword(newPasswordInput.trim());
    setMasterKeyInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
        
        {/* Header Icon */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700 shadow-xs mb-3">
            <Lock className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
            پرهون طرح · بخش ویژه مدیران
          </span>
          <h2 className="text-xl font-black text-stone-900 mt-2">
            ورود به {targetTabName}
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            {isForgotMode 
              ? 'بازیابی رمز مدیر زائرخانه‌ها با استفاده از رمز اصلی سازنده' 
              : 'جهت مشاهده آمار نظرات، تغییر پرسشنامه‌ها و تنظیمات رمز عبور را وارد کنید.'}
          </p>
        </div>

        {resetSuccessMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resetSuccessMessage}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Regular Login Form */}
        {!isForgotMode ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-800">
                  رمز عبور مدیریت
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotMode(true);
                    setError(null);
                  }}
                  className="text-[11px] font-medium text-amber-700 hover:text-amber-900 cursor-pointer underline underline-offset-2"
                >
                  فراموشی رمز عبور؟
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  placeholder="رمز عبور مدیر..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-xl pr-3.5 pl-10 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>تأیید و ورود به پنل</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl transition-colors cursor-pointer"
              >
                انصراف و بازگشت به فرم مهمان
              </button>
            </div>

            <div className="pt-2 border-t border-stone-100 text-center">
              <p className="text-[11px] text-stone-400">
                رمز عبور اولیه ادمین: <code className="font-mono text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">admin</code>
              </p>
            </div>
          </form>
        ) : (
          /* Forgot Password Flow using Creator Master Password: "parhoon" */
          <form onSubmit={handleMasterReset} className="space-y-4">
            
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
              <strong>راهنمای بازیابی:</strong> اگر مدیر رمز عبور اختصاصی خود را فراموش کرده است، با وارد کردن رمز سازنده اصلی سیستم (<code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-amber-300">parhoon</code>) می‌تواند رمز عبور جدیدی تعیین کند.
            </div>

            {/* Creator Master Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                رمز عبور سازنده (Creator Password) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  autoFocus
                  placeholder="parhoon"
                  value={masterKeyInput}
                  onChange={(e) => setMasterKeyInput(e.target.value)}
                  className="w-full text-sm bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                رمز عبور جدید دلخواه ادمین <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                placeholder="رمز عبور جدید..."
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                dir="ltr"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                تکرار رمز عبور جدید <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                placeholder="تکرار رمز عبور..."
                value={confirmPasswordInput}
                onChange={(e) => setConfirmPasswordInput(e.target.value)}
                className="w-full text-sm bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                dir="ltr"
              />
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>ثبت رمز عبور جدید و بازیابی</span>
                <Check className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsForgotMode(false);
                  setError(null);
                }}
                className="w-full py-2 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>بازگشت به فرم ورود</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
