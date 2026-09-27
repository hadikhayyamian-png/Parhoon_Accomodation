import { Accommodation, Question, FeedbackSubmission, DashboardMetrics } from '../types';
import { INITIAL_ACCOMMODATIONS, INITIAL_QUESTIONS, INITIAL_SUBMISSIONS } from '../data/initialData';

const STORAGE_KEYS = {
  PROPERTIES: 'parhoon_properties_v1',
  QUESTIONS: 'parhoon_questions_v1',
  SUBMISSIONS: 'parhoon_submissions_v1',
};

export const getAccommodations = (): Accommodation[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(INITIAL_ACCOMMODATIONS));
      return INITIAL_ACCOMMODATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACCOMMODATIONS;
  }
};

export const saveAccommodations = (accommodations: Accommodation[]): void => {
  localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(accommodations));
};

export const addAccommodation = (acc: Omit<Accommodation, 'id'>): Accommodation => {
  const current = getAccommodations();
  const newAcc: Accommodation = {
    ...acc,
    id: `prop-${Date.now()}`
  };
  const updated = [...current, newAcc];
  saveAccommodations(updated);
  return newAcc;
};

export const getQuestions = (): Question[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(INITIAL_QUESTIONS));
      return INITIAL_QUESTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_QUESTIONS;
  }
};

export const saveQuestions = (questions: Question[]): void => {
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
};

export const addQuestion = (question: Omit<Question, 'id'>): Question => {
  const current = getQuestions();
  const newQuestion: Question = {
    ...question,
    id: `q-${Date.now()}`
  };
  const updated = [...current, newQuestion];
  saveQuestions(updated);
  return newQuestion;
};

export const updateQuestion = (id: string, updates: Partial<Question>): void => {
  const current = getQuestions();
  const updated = current.map(q => q.id === id ? { ...q, ...updates } : q);
  saveQuestions(updated);
};

export const deleteQuestion = (id: string): void => {
  const current = getQuestions();
  const updated = current.filter(q => q.id !== id);
  saveQuestions(updated);
};

export const resetQuestionsToDefault = (): Question[] => {
  saveQuestions(INITIAL_QUESTIONS);
  return INITIAL_QUESTIONS;
};

export const getSubmissions = (): FeedbackSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SUBMISSIONS;
  }
};

export const saveSubmissions = (submissions: FeedbackSubmission[]): void => {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
};

export const generateTrackingCode = (propertyCode: string): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `PRH-${propertyCode}-${randomNum}`;
};

export const addSubmission = (sub: Omit<FeedbackSubmission, 'id' | 'createdAt' | 'trackingCode' | 'status'> & { trackingCode?: string }): FeedbackSubmission => {
  const current = getSubmissions();
  const propertyCode = sub.propertyName.includes('۴۰۸') ? '408' : sub.propertyName.includes('۴۰۹') ? '409' : 'GEN';
  
  const newSub: FeedbackSubmission = {
    ...sub,
    id: `sub-${Date.now()}`,
    trackingCode: sub.trackingCode || generateTrackingCode(propertyCode),
    createdAt: new Date().toISOString(),
    status: 'new'
  };

  const updated = [newSub, ...current];
  saveSubmissions(updated);
  return newSub;
};

export const updateSubmissionStatus = (id: string, status: FeedbackSubmission['status'], adminNotes?: string): void => {
  const current = getSubmissions();
  const updated = current.map(s => {
    if (s.id === id) {
      return {
        ...s,
        status,
        adminNotes: adminNotes !== undefined ? adminNotes : s.adminNotes
      };
    }
    return s;
  });
  saveSubmissions(updated);
};

export const calculateMetrics = (propertyId: string = 'all', submissionsList?: FeedbackSubmission[]): DashboardMetrics => {
  const allSubmissions = submissionsList || getSubmissions();
  const filtered = propertyId === 'all' 
    ? allSubmissions 
    : allSubmissions.filter(s => s.propertyId === propertyId);

  if (filtered.length === 0) {
    return {
      totalFeedbacks: 0,
      averageRating: 0,
      recommendationRate: 0,
      firstTimeGuestsRate: 0,
      pendingFollowups: 0,
      categoryAverages: {},
      ratingDistribution: [
        { stars: 5, count: 0, percentage: 0 },
        { stars: 4, count: 0, percentage: 0 },
        { stars: 3, count: 0, percentage: 0 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 },
      ]
    };
  }

  const total = filtered.length;
  const ratingSum = filtered.reduce((acc, curr) => acc + curr.overallRating, 0);
  const averageRating = Number((ratingSum / total).toFixed(1));

  // Recommendation rate
  const positiveRecommendations = filtered.filter(s => 
    s.recommendationChoice === 'بله، قطعاً' || s.recommendationChoice === 'احتمالاً بله'
  ).length;
  const recommendationRate = Math.round((positiveRecommendations / total) * 100);

  // First time guests rate
  const firstTimers = filtered.filter(s => s.guestInfo.stayHistory === 'first_time').length;
  const firstTimeGuestsRate = Math.round((firstTimers / total) * 100);

  // Pending followups
  const pendingFollowups = filtered.filter(s => s.status === 'followup_needed' || s.status === 'new').length;

  // Star distribution
  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  filtered.forEach(s => {
    const rounded = Math.min(5, Math.max(1, Math.round(s.overallRating)));
    starCounts[rounded] = (starCounts[rounded] || 0) + 1;
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: starCounts[stars] || 0,
    percentage: Math.round(((starCounts[stars] || 0) / total) * 100)
  }));

  // Category breakdown
  // q1: cleanliness, q2: staff, q3: comfort, q4: facilities, q5: location
  const catSums: Record<string, { sum: number; count: number }> = {
    cleanliness: { sum: 0, count: 0 },
    staff: { sum: 0, count: 0 },
    comfort: { sum: 0, count: 0 },
    facilities: { sum: 0, count: 0 },
    location: { sum: 0, count: 0 }
  };

  filtered.forEach(s => {
    if (typeof s.answers['q1'] === 'number') { catSums.cleanliness.sum += s.answers['q1']; catSums.cleanliness.count++; }
    if (typeof s.answers['q2'] === 'number') { catSums.staff.sum += s.answers['q2']; catSums.staff.count++; }
    if (typeof s.answers['q3'] === 'number') { catSums.comfort.sum += s.answers['q3']; catSums.comfort.count++; }
    if (typeof s.answers['q4'] === 'number') { catSums.facilities.sum += s.answers['q4']; catSums.facilities.count++; }
    if (typeof s.answers['q5'] === 'number') { catSums.location.sum += s.answers['q5']; catSums.location.count++; }
  });

  const categoryAverages: Record<string, number> = {};
  Object.keys(catSums).forEach(cat => {
    categoryAverages[cat] = catSums[cat].count > 0 
      ? Number((catSums[cat].sum / catSums[cat].count).toFixed(1)) 
      : 0;
  });

  return {
    totalFeedbacks: total,
    averageRating,
    recommendationRate,
    firstTimeGuestsRate,
    pendingFollowups,
    categoryAverages,
    ratingDistribution
  };
};

export const exportSubmissionsToCsv = (submissions: FeedbackSubmission[]): void => {
  const headers = [
    'کد پیگیری',
    'اقامتگاه',
    'نام و نام خانوادگی',
    'شماره تماس',
    'کد ملی',
    'شهر مبدا',
    'شماره اتاق',
    'تاریخ ورود',
    'تاریخ خروج',
    'تعداد همراهان',
    'سابقه اقامت',
    'نسبت سازمانی',
    'امتیاز کل',
    'پیشنهاد به دیگران',
    'انتقادات و پیشنهادات',
    'تاریخ ثبت',
    'وضعیت پیگیری'
  ];

  const stayHistoryLabels: Record<string, string> = {
    first_time: 'بار اول',
    '2_to_3_times': '۲ تا ۳ بار',
    more_than_3: 'بیش از ۳ بار'
  };

  const statusLabels: Record<string, string> = {
    new: 'جدید',
    reviewed: 'بررسی شده',
    followup_needed: 'نیازمند اقدام',
    resolved: 'اقدام شده'
  };

  const rows = submissions.map(s => [
    `"${s.trackingCode}"`,
    `"${s.propertyName}"`,
    `"${s.guestInfo.fullName}"`,
    `"${s.guestInfo.mobile}"`,
    `"${s.guestInfo.nationalId || '-'}"`,
    `"${s.guestInfo.originCity}"`,
    `"${s.guestInfo.roomNumber}"`,
    `"${s.guestInfo.checkInDate}"`,
    `"${s.guestInfo.checkOutDate}"`,
    `"${s.guestInfo.guestCount}"`,
    `"${stayHistoryLabels[s.guestInfo.stayHistory] || s.guestInfo.stayHistory}"`,
    `"${s.guestInfo.affiliation}"`,
    `"${s.overallRating}"`,
    `"${s.recommendationChoice || '-'}"`,
    `"${(s.generalNotes || '').replace(/"/g, '""')}"`,
    `"${new Date(s.createdAt).toLocaleDateString('fa-IR')}"`,
    `"${statusLabels[s.status] || s.status}"`
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `parhoon_tarh_feedback_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
