import { Accommodation, Question, FeedbackSubmission } from '../types';

export const INITIAL_ACCOMMODATIONS: Accommodation[] = [
  {
    id: 'mashhad-408',
    code: '۴۰۸',
    name: 'زائرخانه ۴۰۸ مشهد',
    city: 'مشهد مقدس',
    address: 'خیابان امام رضا (ع)، خیابان حنایی (دانش شرقی)، کوچه حنایی ۱۲، پلاک ۲۴',
    roomCount: 16,
    capacity: 65,
    managerName: 'مهندس حسینی',
    managerPhone: '۰۹۱۵۱۱۰۲۳۴۵',
    active: true,
    notes: 'زائرخانه اختصاصی پرهون طرح ویژه پرسنل و خانواده‌های محترم با فاصله ۱۰ دقیقه‌ای تا حرم مطهر'
  },
  {
    id: 'mashhad-409',
    code: '۴۰۹',
    name: 'زائرخانه ۴۰۹ مشهد',
    city: 'مشهد مقدس',
    address: 'خیابان آیت‌الله بهجت، بهجت ۷، نبش تقاطع اول، ساختمان پرهون طرح',
    roomCount: 12,
    capacity: 48,
    managerName: 'آقای صادقی',
    managerPhone: '۰۹۱۵۳۱۵۶۷۸۹',
    active: true,
    notes: 'زائرخانه سوئیت‌آپارتمانی نوساز پرهون طرح مجهز به آشپزخانه مستقل و پارکینگ اختصاصی'
  }
];

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'q1',
    propertyId: 'all',
    category: 'cleanliness',
    title: 'نظافت و پاکیزگی کلی اتاق، ملحفه‌ها و سرویس‌های بهداشتی',
    description: 'میزان تمیزی اتاق در بدو ورود و شرایط بهداشتی در طول اقامت',
    type: 'rating_5',
    required: true,
    order: 1
  },
  {
    id: 'q2',
    propertyId: 'all',
    category: 'staff',
    title: 'برخورد، ادب و پاسخگویی پرسنل پذیرش و خدمات زائرخانه',
    description: 'نحوه تحویل اتاق، راهنمایی و توجه به درخواست‌های زائران',
    type: 'rating_5',
    required: true,
    order: 2
  },
  {
    id: 'q3',
    propertyId: 'all',
    category: 'comfort',
    title: 'کارکرد سیستم سرمایش/گرمایش، تهویه و کیفیت خواب (تخت و بالش)',
    description: 'دمای مطبوع هوای اتاق و آسایش در زمان استراحت',
    type: 'rating_5',
    required: true,
    order: 3
  },
  {
    id: 'q4',
    propertyId: 'all',
    category: 'facilities',
    title: 'تجهیزات رفاهی، آب گرم، تلویزیون و وسایل پخت‌وپز',
    description: 'سلامت وسایل برقی، یخچال و ظروف موجود در واحد',
    type: 'rating_5',
    required: true,
    order: 4
  },
  {
    id: 'q5',
    propertyId: 'all',
    category: 'location',
    title: 'سهولت دسترسی به حرم مطهر امام رضا (ع) و مراکز خرید',
    description: 'مسافت پیاده‌روی یا دسترسی به حمل‌ونقل عمومی و تاکسی',
    type: 'rating_5',
    required: true,
    order: 5
  },
  {
    id: 'q6',
    propertyId: 'all',
    category: 'general',
    title: 'آیا اقامت در این زائرخانه را به سایر همکاران و آشنایان پیشنهاد می‌کنید؟',
    description: 'شاخص وفاداری و رضایت کلی از اقامت در زائرخانه پرهون طرح',
    type: 'choice_single',
    options: ['بله، قطعاً', 'احتمالاً بله', 'شاید با کمی بهبود', 'خیر، پیشنهاد نمی‌کنم'],
    required: true,
    order: 6
  },
  {
    id: 'q7',
    propertyId: 'all',
    category: 'general',
    title: 'پیشنهادات، انتقادات، نکات مثبت یا وسایل نیازمند تعمیر',
    description: 'نظر شما برای ارتقای خدمات شرکت پرهون طرح بسیار ارزشمند است',
    type: 'text',
    required: false,
    order: 7
  }
];

export const INITIAL_SUBMISSIONS: FeedbackSubmission[] = [
  {
    id: 'sub-101',
    trackingCode: 'PRH-408-9821',
    propertyId: 'mashhad-408',
    propertyName: 'زائرخانه ۴۰۸ مشهد',
    guestInfo: {
      fullName: 'محمدرضا رضایی',
      mobile: '09123456789',
      nationalId: '0012345678',
      originCity: 'تهران',
      roomNumber: '۳۰۲',
      checkInDate: '۱۴۰۴/۰۱/۱۵',
      checkOutDate: '۱۴۰۴/۰۱/۱۹',
      stayDurationDays: 4,
      stayHistory: 'first_time',
      guestCount: 4,
      affiliation: 'personnel'
    },
    answers: {
      q1: 5,
      q2: 5,
      q3: 4,
      q4: 4,
      q5: 5,
      q6: 'بله، قطعاً',
      q7: 'بسیار تمیز و مرتب بود. نزدیکی به باب‌الرضا عالی بود و کادر پذیرش با گشاده‌رویی تحویل دادند. از شرکت پرهون طرح صمیمانه سپاسگزاریم.'
    },
    overallRating: 4.6,
    recommendationChoice: 'بله، قطعاً',
    generalNotes: 'بسیار تمیز و مرتب بود. نزدیکی به باب‌الرضا عالی بود و کادر پذیرش با گشاده‌رویی تحویل دادند.',
    createdAt: '2026-09-24T18:30:00.000Z',
    status: 'reviewed',
    adminNotes: 'نظرسنجی بررسی شد، از پذیرش ۴۰۸ تقدیر به عمل آمد.'
  },
  {
    id: 'sub-102',
    trackingCode: 'PRH-409-4512',
    propertyId: 'mashhad-409',
    propertyName: 'زائرخانه ۴۰۹ مشهد',
    guestInfo: {
      fullName: 'فاطمه احمدی‌پور',
      mobile: '09131234567',
      nationalId: '1287654321',
      originCity: 'اصفهان',
      roomNumber: '۲۰۴',
      checkInDate: '۱۴۰۴/۰۱/۱۶',
      checkOutDate: '۱۴۰۴/۰۱/۲۰',
      stayDurationDays: 4,
      stayHistory: '2_to_3_times',
      guestCount: 3,
      affiliation: 'family'
    },
    answers: {
      q1: 5,
      q2: 4,
      q3: 5,
      q4: 5,
      q5: 4,
      q6: 'بله، قطعاً',
      q7: 'امکانات پخت‌وپز سوئیت ۴۰۹ فوق‌العاده بود. برای سفرهای خانوادگی با بچه کوچک بسیار آرامش‌بخش بود.'
    },
    overallRating: 4.6,
    recommendationChoice: 'بله، قطعاً',
    generalNotes: 'امکانات پخت‌وپز سوئیت ۴۰۹ فوق‌العاده بود.',
    createdAt: '2026-09-24T14:15:00.000Z',
    status: 'reviewed'
  },
  {
    id: 'sub-103',
    trackingCode: 'PRH-408-3329',
    propertyId: 'mashhad-408',
    propertyName: 'زائرخانه ۴۰۸ مشهد',
    guestInfo: {
      fullName: 'علی‌اکبر صالحی',
      mobile: '09359876543',
      nationalId: '0459871234',
      originCity: 'شیراز',
      roomNumber: '۱۰۱',
      checkInDate: '۱۴۰۴/۰۱/۱۴',
      checkOutDate: '۱۴۰۴/۰۱/۱۸',
      stayDurationDays: 4,
      stayHistory: 'more_than_3',
      guestCount: 2,
      affiliation: 'personnel'
    },
    answers: {
      q1: 4,
      q2: 5,
      q3: 3,
      q4: 4,
      q5: 5,
      q6: 'احتمالاً بله',
      q7: 'فشار آب گرم در ساعات صبح کمی افت داشت. لطفاً پمپ آب طبقه اول چک شود، بقیه موارد مانند همیشه عالی بود.'
    },
    overallRating: 4.2,
    recommendationChoice: 'احتمالاً بله',
    generalNotes: 'فشار آب گرم در ساعات صبح کمی افت داشت.',
    createdAt: '2026-09-23T11:00:00.000Z',
    status: 'followup_needed',
    adminNotes: 'به تاسیسات زائرخانه ۴۰۸ ارجاع شد تا پمپ آب طبقه اول بررسی و تنظیم گردد.'
  },
  {
    id: 'sub-104',
    trackingCode: 'PRH-409-7714',
    propertyId: 'mashhad-409',
    propertyName: 'زائرخانه ۴۰۹ مشهد',
    guestInfo: {
      fullName: 'سید مهران حسینی',
      mobile: '09176543210',
      nationalId: '2298761234',
      originCity: 'یزد',
      roomNumber: '۴۰۱',
      checkInDate: '۱۴۰۴/۰۱/۱۷',
      checkOutDate: '۱۴۰۴/۰۱/۲۱',
      stayDurationDays: 4,
      stayHistory: 'first_time',
      guestCount: 5,
      affiliation: 'corporate_guest'
    },
    answers: {
      q1: 5,
      q2: 5,
      q3: 5,
      q4: 5,
      q5: 4,
      q6: 'بله، قطعاً',
      q7: 'کیفیت ساخت و تجهیزات زائرخانه ۴۰۹ شایسته نام پرهون طرح است. با تشکر فراوان از مدیریت محترم.'
    },
    overallRating: 4.8,
    recommendationChoice: 'بله، قطعاً',
    generalNotes: 'کیفیت ساخت و تجهیزات زائرخانه ۴۰۹ شایسته نام پرهون طرح است.',
    createdAt: '2026-09-22T09:40:00.000Z',
    status: 'reviewed'
  },
  {
    id: 'sub-105',
    trackingCode: 'PRH-408-1188',
    propertyId: 'mashhad-408',
    propertyName: 'زائرخانه ۴۰۸ مشهد',
    guestInfo: {
      fullName: 'مریم سادات کاظمی',
      mobile: '09144455667',
      nationalId: '1371234567',
      originCity: 'تبریز',
      roomNumber: '۲۰۵',
      checkInDate: '۱۴۰۴/۰۱/۱۸',
      checkOutDate: '۱۴۰۴/۰۱/۲۲',
      stayDurationDays: 4,
      stayHistory: 'first_time',
      guestCount: 4,
      affiliation: 'family'
    },
    answers: {
      q1: 4,
      q2: 4,
      q3: 4,
      q4: 3,
      q5: 5,
      q6: 'احتمالاً بله',
      q7: 'اگر چای‌ساز یا کتری برقی به اتاق‌ها اضافه شود بسیار کاربردی خواهد بود. تشکر از پرسنل مهربان.'
    },
    overallRating: 4.0,
    recommendationChoice: 'احتمالاً بله',
    generalNotes: 'اگر چای‌ساز یا کتری برقی به اتاق‌ها اضافه شود بسیار کاربردی خواهد بود.',
    createdAt: '2026-09-21T16:20:00.000Z',
    status: 'new'
  },
  {
    id: 'sub-106',
    trackingCode: 'PRH-409-5502',
    propertyId: 'mashhad-409',
    propertyName: 'زائرخانه ۴۰۹ مشهد',
    guestInfo: {
      fullName: 'امید ترابی',
      mobile: '09361122334',
      nationalId: '0078912345',
      originCity: 'کرج',
      roomNumber: '۳۰۲',
      checkInDate: '۱۴۰۴/۰۱/۱۹',
      checkOutDate: '۱۴۰۴/۰۱/۲۳',
      stayDurationDays: 4,
      stayHistory: '2_to_3_times',
      guestCount: 3,
      affiliation: 'personnel'
    },
    answers: {
      q1: 5,
      q2: 5,
      q3: 5,
      q4: 4,
      q5: 5,
      q6: 'بله، قطعاً',
      q7: 'همه‌چیز مرتب و در شأن همکاران پرهون طرح بود. نظافت و سکوت عالی بود.'
    },
    overallRating: 4.8,
    recommendationChoice: 'بله، قطعاً',
    generalNotes: 'همه‌چیز مرتب و در شأن همکاران پرهون طرح بود.',
    createdAt: '2026-09-20T12:00:00.000Z',
    status: 'reviewed'
  }
];
