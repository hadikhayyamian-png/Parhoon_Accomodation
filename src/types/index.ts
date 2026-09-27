export type QuestionType = 'rating_5' | 'choice_single' | 'text' | 'yes_no' | 'nps_scale';

export type QuestionCategory = 'cleanliness' | 'staff' | 'comfort' | 'facilities' | 'location' | 'general';

export interface Question {
  id: string;
  propertyId: string; // 'all' or specific accommodation id like 'mashhad-408'
  category: QuestionCategory;
  title: string;
  description?: string;
  type: QuestionType;
  options?: string[]; // for choice_single
  required: boolean;
  order: number;
}

export interface Accommodation {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  roomCount: number;
  capacity: number;
  managerName: string;
  managerPhone: string;
  active: boolean;
  notes?: string;
}

export type StayHistory = 'first_time' | '2_to_3_times' | 'more_than_3';
export type AffiliationType = 'personnel' | 'family' | 'corporate_guest' | 'other';

export interface GuestContactInfo {
  fullName: string;
  mobile: string;
  nationalId?: string;
  originCity: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  stayDurationDays?: number;
  stayHistory: StayHistory;
  guestCount: number;
  affiliation: AffiliationType;
}

export type FeedbackStatus = 'new' | 'reviewed' | 'followup_needed' | 'resolved';

export interface FeedbackSubmission {
  id: string;
  trackingCode: string;
  propertyId: string;
  propertyName: string;
  guestInfo: GuestContactInfo;
  answers: Record<string, any>; // questionId -> value
  overallRating: number;
  recommendationChoice?: string;
  generalNotes?: string;
  createdAt: string;
  status: FeedbackStatus;
  adminNotes?: string;
}

export interface DashboardMetrics {
  totalFeedbacks: number;
  averageRating: number;
  recommendationRate: number; // percentage
  firstTimeGuestsRate: number;
  pendingFollowups: number;
  categoryAverages: Record<string, number>;
  ratingDistribution: {
    stars: number;
    count: number;
    percentage: number;
  }[];
}
