import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  HelpCircle, 
  CheckCircle2, 
  Star, 
  AlignLeft, 
  ListFilter, 
  CheckSquare, 
  Eye,
  Building2,
  X
} from 'lucide-react';
import { Question, QuestionType, QuestionCategory, Accommodation } from '../../types';
import { addQuestion, updateQuestion, deleteQuestion, resetQuestionsToDefault, saveQuestions } from '../../utils/storage';
import { INITIAL_ACCOMMODATIONS } from '../../data/initialData';

interface QuestionnaireManagerProps {
  questions: Question[];
  accommodations: Accommodation[];
  onQuestionsChange: () => void;
}

export const QuestionnaireManager: React.FC<QuestionnaireManagerProps> = ({
  questions = [],
  accommodations = [],
  onQuestionsChange
}) => {
  const safeAccommodations = accommodations.length > 0 ? accommodations : INITIAL_ACCOMMODATIONS;
  const [selectedPropertyFilter, setSelectedPropertyFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Form State for Add / Edit
  const [formData, setFormData] = useState<{
    propertyId: string;
    category: QuestionCategory;
    title: string;
    description: string;
    type: QuestionType;
    optionsText: string;
    required: boolean;
  }>({
    propertyId: 'all',
    category: 'cleanliness',
    title: '',
    description: '',
    type: 'rating_5',
    optionsText: 'بله، قطعاً\nاحتمالاً بله\nشاید با کمی بهبود\nخیر، پیشنهاد نمی‌کنم',
    required: true
  });

  // Filtered by selected property
  const filteredQuestions = questions
    .filter(q => selectedPropertyFilter === 'all' || q.propertyId === 'all' || q.propertyId === selectedPropertyFilter)
    .sort((a, b) => a.order - b.order);

  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setFormData({
      propertyId: selectedPropertyFilter === 'all' ? 'all' : selectedPropertyFilter,
      category: 'cleanliness',
      title: '',
      description: '',
      type: 'rating_5',
      optionsText: 'بله، قطعاً\nاحتمالاً بله\nشاید\nخیر',
      required: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q: Question) => {
    setEditingQuestion(q);
    setFormData({
      propertyId: q.propertyId,
      category: q.category,
      title: q.title,
      description: q.description || '',
      type: q.type,
      optionsText: q.options ? q.options.join('\n') : '',
      required: q.required
    });
    setIsModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const parsedOptions = formData.type === 'choice_single' 
      ? formData.optionsText.split('\n').map(s => s.trim()).filter(Boolean)
      : undefined;

    if (editingQuestion) {
      updateQuestion(editingQuestion.id, {
        propertyId: formData.propertyId,
        category: formData.category,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        options: parsedOptions,
        required: formData.required
      });
    } else {
      const maxOrder = questions.reduce((max, q) => Math.max(max, q.order), 0);
      addQuestion({
        propertyId: formData.propertyId,
        category: formData.category,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        options: parsedOptions,
        required: formData.required,
        order: maxOrder + 1
      });
    }

    setIsModalOpen(false);
    onQuestionsChange();
  };

  const handleDelete = (id: string) => {
    if (confirm('آیا از حذف این سوال از پرسشنامه اطمینان دارید؟')) {
      deleteQuestion(id);
      onQuestionsChange();
    }
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const list = [...filteredQuestions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    // Swap order values
    const currentQ = list[index];
    const targetQ = list[targetIndex];
    const tempOrder = currentQ.order;
    currentQ.order = targetQ.order;
    targetQ.order = tempOrder;

    saveQuestions(questions);
    onQuestionsChange();
  };

  const handleResetDefaults = () => {
    if (confirm('آیا مایلید تمام سوالات به تنظیمات پیش‌فرض شرکت پرهون طرح بازنشانی شوند؟')) {
      resetQuestionsToDefault();
      onQuestionsChange();
    }
  };

  const categoryLabels: Record<QuestionCategory, string> = {
    cleanliness: 'نظافت و بهداشت',
    staff: 'برخورد پرسنل',
    comfort: 'آسایش و خواب',
    facilities: 'امکانات و آشپزخانه',
    location: 'موقعیت و دسترسی به حرم',
    general: 'عمومی و نظرات'
  };

  const typeLabels: Record<QuestionType, string> = {
    rating_5: 'امتیاز ۵ ستاره‌ای',
    choice_single: 'چندگزینه‌ای تک‌انتخابی',
    text: 'پاسخ متنی تشریحی',
    yes_no: 'بله / خیر',
    nps_scale: 'شاخص عددی'
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span>مدیریت ساختار فرم</span>
              <span aria-hidden="true">·</span>
              <span>پرسشنامه‌های اختصاصی پرهون طرح</span>
            </div>
            <h1 className="text-lg font-bold text-stone-900">
              مدیریت و طراحی سوالات پرسشنامه اقامت
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              فرم مشخصات تماس مهمان ثابت (Hardcoded) بوده و سوالات ارزیابی زیر توسط ادمین برای هر زائرخانه قابل ویرایش و شخصی‌سازی است.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-stone-600" />
              <span>{showPreview ? 'بستن پیش‌نمایش' : 'پیش‌نمایش زنده'}</span>
            </button>

            <button
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-50 border border-stone-200 rounded-xl transition-all cursor-pointer"
              title="بازنشانی سوالات به حالت اولیه"
            >
              <RotateCcw className="w-4 h-4" />
              <span>بازنشانی پیش‌فرض</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن سوال جدید</span>
            </button>
          </div>
        </div>

        {/* Accommodation Filter */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-600">فیلتر پرسشنامه برای:</span>
          <select
            value={selectedPropertyFilter}
            onChange={(e) => setSelectedPropertyFilter(e.target.value)}
            className="text-xs font-semibold bg-stone-50 border border-stone-300 rounded-lg px-3 py-1.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
          >
            <option value="all">همه زائرخانه‌ها (مشترک)</option>
            {safeAccommodations.map(acc => (
              <option key={acc.id} value={acc.id}>
                {acc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content: Question List or Live Preview */}
      {showPreview ? (
        /* Live Preview Mode */
        <div className="bg-stone-50 border border-stone-300 rounded-2xl p-6 shadow-inner">
          <div className="max-w-xl mx-auto bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
            <div className="border-b border-stone-200 pb-3 mb-4">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                پیش‌نمایش پرسشنامه مهمان
              </span>
              <h2 className="text-base font-bold text-stone-900 mt-2">
                پرسشنامه ارزیابی دوره اقامت در زائرخانه
              </h2>
            </div>

            <div className="space-y-4">
              {filteredQuestions.map((q, idx) => (
                <div key={q.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <div className="font-bold text-stone-800 mb-1">
                    {idx + 1}. {q.title} {q.required && <span className="text-rose-500">*</span>}
                  </div>
                  {q.description && <div className="text-[11px] text-stone-500 mb-2">{q.description}</div>}
                  
                  {q.type === 'rating_5' && (
                    <div className="flex gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className="w-5 h-5 fill-amber-400" />
                      ))}
                    </div>
                  )}

                  {q.type === 'choice_single' && q.options && (
                    <div className="space-y-1 mt-2">
                      {q.options.map(opt => (
                        <div key={opt} className="px-2.5 py-1.5 bg-white rounded border border-stone-200 text-stone-700">
                          ○ {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'text' && (
                    <div className="h-14 bg-white border border-stone-200 rounded p-2 text-stone-400 text-[11px]">
                      محل پاسخ متنی مهمان...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Questions Management List */
        <div className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="divide-y divide-stone-100">
            {filteredQuestions.length === 0 ? (
              <div className="py-12 text-center text-stone-400 text-xs">
                هنوز سوالی برای این بخش تعریف نشده است. با دکمه «افزودن سوال جدید» شروع کنید.
              </div>
            ) : (
              filteredQuestions.map((q, idx) => {
                const targetProp = safeAccommodations.find(a => a.id === q.propertyId);
                return (
                  <div 
                    key={q.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/50 transition-colors"
                  >
                    
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-700 shrink-0 font-mono">
                        {idx + 1}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-xs sm:text-sm font-bold text-stone-900">
                            {q.title}
                          </h3>
                          {q.required && (
                            <span className="text-[10px] text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded font-medium">
                              پاسخ الزامی
                            </span>
                          )}
                          <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.2 rounded">
                            {categoryLabels[q.category] || q.category}
                          </span>
                        </div>

                        {q.description && (
                          <p className="text-xs text-stone-500 mb-1">
                            {q.description}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[11px] text-stone-400">
                          <span>نوع سوال: <strong className="text-stone-700">{typeLabels[q.type]}</strong></span>
                          <span aria-hidden="true">·</span>
                          <span>اختصاص یافته به: <strong className="text-stone-700">{targetProp ? targetProp.name : 'همه زائرخانه‌ها'}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Order and Action Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleMoveOrder(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 text-stone-400 hover:text-stone-700 disabled:opacity-30 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                        title="انتقال به بالا"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleMoveOrder(idx, 'down')}
                        disabled={idx === filteredQuestions.length - 1}
                        className="p-1.5 text-stone-400 hover:text-stone-700 disabled:opacity-30 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                        title="انتقال به پایین"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(q)}
                        className="p-1.5 text-amber-700 hover:text-amber-900 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                        title="ویرایش سوال"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(q.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="حذف سوال"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
              <h2 className="text-base font-bold text-stone-900">
                {editingQuestion ? 'ویرایش سوال پرسشنامه' : 'افزودن سوال جدید به پرسشنامه'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              
              {/* Accommodation Target */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  مرتبط با کدام زائرخانه باشد؟
                </label>
                <select
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">همه زائرخانه‌ها (مشترک)</option>
                  {safeAccommodations.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  متن و عنوان سوال <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: کیفیت و دمای آب گرم حمام و فشار آب"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Category & Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    دسته‌بندی موضوعی
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="cleanliness">نظافت و بهداشت</option>
                    <option value="staff">برخورد و کادر پرسنل</option>
                    <option value="comfort">آسایش، خواب و تهویه</option>
                    <option value="facilities">امکانات رفاهی و پخت‌وپز</option>
                    <option value="location">موقعیت و دسترسی به حرم</option>
                    <option value="general">عمومی و پیشنهادات</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    قالب و نوع سوال
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="rating_5">امتیاز ۵ ستاره‌ای</option>
                    <option value="choice_single">چند گزینه‌ای</option>
                    <option value="text">تشریحی متنی</option>
                    <option value="yes_no">بله / خیر</option>
                  </select>
                </div>
              </div>

              {/* Options text if Choice single */}
              {formData.type === 'choice_single' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    گزینه‌های پاسخ (هر گزینه در یک سطر)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.optionsText}
                    onChange={(e) => setFormData({ ...formData, optionsText: e.target.value })}
                    className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl p-2.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  راهنما یا توضیحات زیر سوال (اختیاری)
                </label>
                <input
                  type="text"
                  placeholder="مثال: وضعیت پاکیزگی در بدو تحویل اتاق"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Required Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="reqCheckbox"
                  checked={formData.required}
                  onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="reqCheckbox" className="text-xs font-semibold text-stone-700 cursor-pointer">
                  پاسخگویی به این سوال الزامی باشد
                </label>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs cursor-pointer"
                >
                  ذخیره سوال
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
