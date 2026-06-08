// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: number
  email: string
  name: string
  role: 'student' | 'school_admin' | 'platform_admin'
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// ─── API Response Wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: string
  status_code: number
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// ─── Courses ─────────────────────────────────────────────────────────────────

export interface Course {
  id: number
  slug: string
  title: string
  description: string
  instructor: string
  modules_count: number
  quiz_count: number
  glossary_terms_count: number
  price: number
  is_enrolled: boolean
  modules?: Module[]    // embedded in course_detail response for public catalog browsing
  color?: string        // track color identity from original HTML courses
  category?: string     // 'real-estate' | 'construction' | 'trades'
}

export interface ModuleLesson {
  id: string
  title: string
  sequence_order: number
  is_completed: boolean
}

export interface Module {
  id: number
  title: string
  sequence_order: number
  is_completed: boolean
  quiz_score: number | null
  lessons_count: number
  lessons?: ModuleLesson[]  // populated by coursesApi.modules()
}

export interface Lesson {
  id: string
  title: string
  sequence_order: number
  body: string
  youtube_url: string | null
  module_id: string
  is_completed: boolean
  prev_lesson_id: string | null
  next_lesson_id: string | null
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export interface QuizAnswer {
  id: string
  answer_text: string
  sequence_order: number
}

export interface QuizQuestion {
  id: string
  question_text: string
  question_type: string
  sequence_order: number
  answers: QuizAnswer[]
}

export interface Quiz {
  id: string
  title: string
  passing_score: number
  max_attempts: number
  attempts_used: number
  attempts_left: number
  can_attempt: boolean
  already_passed: boolean
  last_score: number | null
  questions: QuizQuestion[]
  attempt_history: QuizAttempt[]
}

export interface QuizSubmission {
  answers: Record<string, string>
}

export interface QuizResult {
  attempt_id: string
  passed: boolean
  score: number
  passing_score: number
  correct_answers: Record<string, string>
  attempts_used: number
  attempts_left: number
  certificate_issued: boolean
}

export interface QuizAttempt {
  attempt_number: number
  score: number
  passed: boolean
  attempted_at: string
}

// ─── Progress ────────────────────────────────────────────────────────────────

export interface CourseProgress {
  course_id: number
  course_slug: string
  course_title: string
  enrollment_date: string
  modules_completed: number
  modules_total: number
  progress_percentage: number
  is_completed: boolean
}

export interface DetailedProgress {
  course_slug: string
  course_title: string
  modules: Array<{
    id: number
    title: string
    is_completed: boolean
    quiz_score: number | null
    lessons: Array<{
      id: number
      title: string
      is_completed: boolean
    }>
  }>
  progress_percentage: number
  is_completed: boolean
  certificate_url: string | null
}

// ─── Enrollment ──────────────────────────────────────────────────────────────

export interface Enrollment {
  id: number
  course_slug: string
  status: 'active' | 'expired' | 'cancelled'
  enrollment_date: string
}

export interface CheckoutSession {
  checkout_url?: string
  session_id?: string
  // 100% off promo code path — enrolled directly without Stripe
  enrolled?: boolean
  enrollment_id?: string
  course_slug?: string
  message?: string
}

// ─── Glossary ────────────────────────────────────────────────────────────────

export interface GlossaryTerm {
  id: number
  term: string
  definition: string
  course_slug: string
}

// ─── Course Color Map ─────────────────────────────────────────────────────────
// Exact colors extracted from the original HTML course files in darco-real-estate-academy repo

export interface CourseColorTheme {
  primary: string       // nav/hero background (darkest)
  mid: string           // mid shade
  light: string         // light accent
  pale: string          // pale background tint
  heroGradient: string  // hero gradient string
  label: string         // color name
}

export const COURSE_COLORS: Record<string, CourseColorTheme> = {
  // Landing page: Forest green + gold
  'real-estate-foundation': {
    primary: '#1B4D3E',
    mid: '#2A6B56',
    light: '#2E6B54',
    pale: '#F0F7F4',
    heroGradient: 'linear-gradient(135deg, #0F2E24 0%, #1B4D3E 60%, #2E6B54 100%)',
    label: 'Forest Green',
  },
  // Residential Agent: Teal
  'real-estate-residential-agent': {
    primary: '#0D6E6E',
    mid: '#1A8A8A',
    light: '#2AACAC',
    pale: '#EAF6F6',
    heroGradient: 'linear-gradient(135deg, #084F4F 0%, #0D6E6E 55%, #1A8A8A 100%)',
    label: 'Teal',
  },
  // Commercial Real Estate: Deep Navy/Forest
  'real-estate-commercial': {
    primary: '#0F2340',
    mid: '#1A3A5C',
    light: '#2A5380',
    pale: '#EBF0F7',
    heroGradient: 'linear-gradient(135deg, #071828 0%, #0F2340 55%, #1A3A5C 100%)',
    label: 'Deep Navy',
  },
  // Investing: Burgundy
  'real-estate-investing': {
    primary: '#5C1A2E',
    mid: '#7D2A42',
    light: '#9E4060',
    pale: '#F9EEF1',
    heroGradient: 'linear-gradient(135deg, #5C1A2E 0%, #7D2A42 55%, #A04060 100%)',
    label: 'Burgundy',
  },
  // Property Management: Steel Blue/Slate
  'real-estate-property-management': {
    primary: '#2C4A6E',
    mid: '#3D6190',
    light: '#5580B0',
    pale: '#EBF0F7',
    heroGradient: 'linear-gradient(135deg, #1A3050 0%, #2C4A6E 55%, #3D6190 100%)',
    label: 'Steel Blue',
  },
  // Real Estate Development: Charcoal + Orange
  'real-estate-development': {
    primary: '#2A2A2A',
    mid: '#D4621A',
    light: '#F08C50',
    pale: '#FDF0E8',
    heroGradient: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 50%, #383838 100%)',
    label: 'Charcoal & Orange',
  },
  // Mortgage & Lending: Deep Purple
  'real-estate-mortgage-lending': {
    primary: '#3D1A6E',
    mid: '#5430A0',
    light: '#7055C0',
    pale: '#F0EBF9',
    heroGradient: 'linear-gradient(135deg, #220E40 0%, #3D1A6E 55%, #5430A0 100%)',
    label: 'Deep Purple',
  },
  // Wholesaling: Burnt Orange (mislabeled "green" in original CSS vars)
  'real-estate-wholesaling': {
    primary: '#B84A10',
    mid: '#D4581A',
    light: '#E87040',
    pale: '#FDF0EA',
    heroGradient: 'linear-gradient(135deg, #6B2A08 0%, #B84A10 55%, #D4581A 100%)',
    label: 'Burnt Orange',
  },
  // Photography: Near-black dark warm
  'real-estate-photography': {
    primary: '#1C1A18',
    mid: '#2E2B28',
    light: '#C8A96A',
    pale: '#F5F2EE',
    heroGradient: 'linear-gradient(135deg, #0E0D0C 0%, #1C1A18 55%, #2E2B28 100%)',
    label: 'Dark Warm',
  },
  // Maintenance & Repair: Rust
  'real-estate-maintenance-repair': {
    primary: '#8B3A1A',
    mid: '#B04A22',
    light: '#D0622E',
    pale: '#FAF0EA',
    heroGradient: 'linear-gradient(135deg, #3A0E04 0%, #8B3A1A 50%, #B04A22 100%)',
    label: 'Rust',
  },
  // Apartment Leasing: Deep Amber
  'apartment-leasing': {
    primary: '#4A3400',
    mid: '#A07010',
    light: '#C49030',
    pale: '#FBF5E0',
    heroGradient: 'linear-gradient(135deg, #2E2000 0%, #7A5800 60%, #C49030 100%)',
    label: 'Deep Amber',
  },
  // Electrician — awaiting file, using yellow/gold placeholder
  'electrician': {
    primary: '#7A6000',
    mid: '#A08010',
    light: '#C8A030',
    pale: '#FDFAE8',
    heroGradient: 'linear-gradient(135deg, #3A2E00 0%, #7A6000 55%, #A08010 100%)',
    label: 'Gold',
  },
  // Construction Painting — LIGHT theme: warm off-white bg + dark navy + muted gold
  // Uses Bebas Neue font (trades/industrial), completely different feel from RE courses
  'construction-painting': {
    primary: '#1a1a2e',
    mid: '#2d2d4a',
    light: '#8a6a10',
    pale: '#f8f7f4',
    heroGradient: 'linear-gradient(135deg, #f8f7f4 0%, #f0ede8 100%)',
    label: 'Industrial Light',
  },
}
