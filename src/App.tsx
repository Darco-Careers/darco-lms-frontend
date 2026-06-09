import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Layouts
import MainLayout from '@/components/layout/MainLayout'
import AuthLayout from '@/components/layout/AuthLayout'

// Pages
import HomePage from '@/pages/HomePage'
import RealEstatePage from '@/pages/RealEstatePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import CourseDetailPage from '@/pages/CourseDetailPage'
import LessonPage from '@/pages/LessonPage'
import QuizPage from '@/pages/QuizPage'
import GlossaryPage from '@/pages/GlossaryPage'
import ProgressPage from '@/pages/ProgressPage'
import CheckoutSuccessPage from '@/pages/CheckoutSuccessPage'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminPromoCodesPage from '@/pages/AdminPromoCodesPage'
import ContactPage from '@/pages/ContactPage'
import FAQPage from '@/pages/FAQPage'

// Admin route wrapper — only accessible to school_admin or platform_admin
function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!user || !['school_admin', 'platform_admin'].includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }
  return <>{children}</>
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/real-estate" element={<RealEstatePage />} />
          <Route path="/courses/:slug" element={<CourseDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Route>

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses/:slug/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/courses/:slug/quiz/:moduleId" element={<QuizPage />} />
          <Route path="/courses/:slug/glossary" element={<GlossaryPage />} />
          <Route path="/courses/:slug/progress" element={<ProgressPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<AdminRoute><MainLayout /></AdminRoute>}>
          <Route path="/admin/promo-codes" element={<AdminPromoCodesPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
