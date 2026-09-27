import React, { useState } from 'react';
import { 
  KeyRound, 
  ShieldCheck, 
  Check, 
  Lock, 
  AlertCircle, 
  Sparkles,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { 
  getStoredAdminPassword, 
  setStoredAdminPassword, 
  CREATOR_MASTER_PASSWORD 
} from '../../utils/auth';

interface ChangePasswordSectionProps {
  onPasswordChanged?: () => void;
  onLogoutAdmin?: () => void;
}

export const ChangePasswordSection: React.FC<ChangePasswordSectionProps> = ({
  onPasswordChanged,
  onLogoutAdmin
}) => {
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const storedPassword = getStoredAdminPassword();
    const isCurrentValid = currentPasswordInput.trim() === storedPassword || currentPasswordInput.trim() === CREATOR_MASTER_PASSWORD;

    if (!isCurrentValid) {
      setErrorMessage('رمز عبور فعلی نامعتبر است. (می‌توانید از رمز فعلی یا رمز سازنده parhoon استفاده کنید)');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMessage('رمز عبور جدید باید حداقل ۴ رقم یا کاراکتر باشد.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('رمز عبور جدید و تکرار آن یکسان نیستند.');
      return;
    }

    setStoredAdminPassword(newPassword.trim());
    setSuccessMessage('رمز عبور پنل مدیریت با موفقیت بروزرسانی شد.');
    setCurrentPasswordInput('');
    setNewPassword('');
    setConfirmPassword('');
    if (onPasswordChanged) onPasswordChanged();

    setTimeout(() => {
      setSuccessMessage(null);
      setIsOpen(false);
    }, 2500);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span>امنیت و رمز عبور پنل مدیریت</span>
              <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-medium">
                رمز سازنده فعال: parhoon
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              مدیر می‌تواند رمز ورود را در هر زمان تغییر دهد. در صورت فراموشی، با رمز سازنده (<code className="font-mono text-stone-700 font-bold">parhoon</code>) همواره دسترسی برقرار است.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3.5 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all cursor-pointer"
          >
            {isOpen ? 'بستن فرم تغییر رمز' : 'تغییر رمز عبور مدیریت'}
          </button>

          {onLogoutAdmin && (
            <button
              onClick={onLogoutAdmin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
              title="خروج از نشست مدیریت"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج از پنل</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Form */}
      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-5 pt-5 border-t border-stone-100 space-y-4 max-w-lg">
          
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                رمز عبور فعلی مدیریت (یا رمز سازنده parhoon) <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                placeholder="رمز فعلی..."
                value={currentPasswordInput}
                onChange={(e) => setCurrentPasswordInput(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                dir="ltr"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  رمز عبور جدید <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="حداقل ۴ کاراکتر"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                  dir="ltr"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  تکرار رمز عبور جدید <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="تکرار رمز جدید"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-left"
                  dir="ltr"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 rounded-xl"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              ذخیره رمز جدید
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
