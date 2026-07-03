import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  ArrowLeft, ArrowRight, CheckCircle, XCircle,
  RotateCcw, Trophy, Clock, BookOpen, ChevronDown, ChevronUp,
} from 'lucide-react'
import { apiClient } from '@/api/client'
import { COURSE_COLORS } from '@/types'
import type { Quiz, QuizResult, SectionBreakdown } from '@/types'
import clsx from 'clsx'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ─── Exam Mode Components ─────────────────────────────────────────────────────

interface ExamHeaderProps {
  slug: string
  current: number
  total: number
  timeLeft: number | null
  timeLimitMinutes: number | null
  themeColor: string
}

function ExamHeader({ slug, current, total, timeLeft, timeLimitMinutes, themeColor }: ExamHeaderProps) {
  const pct = Math.round((current / total) * 100)
  const isLow = timeLeft !== null && timeLeft < 300 // < 5 min

  return (
    <div className="sticky top-16 z-40 bg-white border-b border-surface-200">
      <div className="page-container max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link
          to={`/courses/${slug}/progress`}
          className="flex items-center gap-1.5 text-surface-500 hover:text-surface-700 text-sm font-body shrink-0"
        >
          <ArrowLeft size={14} />
          Exit
        </Link>

        {/* Progress bar + counter */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-body text-surface-500">
              Question {current} of {total}
            </span>
            <span className="text-xs font-body text-surface-400">{pct}%</span>
          </div>
          <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, background: themeColor }}
            />
          </div>
        </div>

        {/* Timer */}
        {timeLimitMinutes !== null && timeLeft !== null && (
          <div
            className={clsx(
              'flex items-center gap-1.5 text-sm font-body font-semibold shrink-0 px-3 py-1 rounded-full',
              isLow
                ? 'bg-red-50 text-red-600 animate-pulse'
                : 'bg-surface-100 text-surface-600'
            )}
          >
            <Clock size={13} />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Section Breakdown Table ──────────────────────────────────────────────────

function SectionBreakdownTable({ breakdown, passingScore }: { breakdown: SectionBreakdown[], passingScore: number }) {
  return (
    <div className="mt-6">
      <h3 className="font-display font-bold text-navy-900 text-base mb-3">Score by topic area</h3>
      <div className="rounded-xl border border-surface-200 overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="bg-surface-50 border-b border-surface-200">
              <th className="text-left px-4 py-2.5 text-surface-500 font-semibold">Topic Area</th>
              <th className="text-center px-4 py-2.5 text-surface-500 font-semibold">Correct</th>
              <th className="text-right px-4 py-2.5 text-surface-500 font-semibold">Score</th>
            </tr>
          </thead>
          <tbody>
            {breakdown.map((row, i) => {
              const pass = row.score >= passingScore
              return (
                <tr key={row.key} className={clsx('border-b border-surface-100', i % 2 === 0 ? 'bg-white' : 'bg-surface-50/50')}>
                  <td className="px-4 py-2.5 text-navy-900 font-medium">{row.label}</td>
                  <td className="px-4 py-2.5 text-center text-surface-600">{row.correct}/{row.total}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={clsx(
                      'inline-block px-2 py-0.5 rounded-full text-xs font-bold',
                      pass ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                    )}>
                      {row.score}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Post-Exam Review ─────────────────────────────────────────────────────────

interface ReviewQuestion {
  id: string
  question_text: string
  answers: { id: string; answer_text: string }[]
  studentAnswer: string | undefined
  correctAnswer: string
  rationale: string | undefined
  section: string
}

function ReviewItem({ q, idx, themeColor }: { q: ReviewQuestion; idx: number; themeColor: string }) {
  const [open, setOpen] = useState(false)
  const isCorrect = q.studentAnswer === q.correctAnswer

  return (
    <div className={clsx(
      'rounded-xl border overflow-hidden',
      isCorrect ? 'border-emerald-200' : 'border-red-200'
    )}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 bg-white hover:bg-surface-50 transition-colors"
      >
        <div className="flex items-start gap-3 min-w-0">
          <span className={clsx(
            'shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5',
            isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
          )}>
            {isCorrect ? '✓' : '✗'}
          </span>
          <p className="font-body text-sm text-navy-900 font-medium leading-snug">
            <span className="text-surface-400 mr-1">{idx + 1}.</span>
            {q.question_text}
          </p>
        </div>
        {open ? <ChevronUp size={16} className="shrink-0 text-surface-400 mt-1" /> : <ChevronDown size={16} className="shrink-0 text-surface-400 mt-1" />}
      </button>

      {open && (
        <div className="px-5 pb-5 bg-white border-t border-surface-100">
          <div className="space-y-2 mt-3">
            {q.answers.map((ans, ansIdx) => {
              const letter = String.fromCharCode(65 + ansIdx)
              const isCorrectAns = ans.id === q.correctAnswer
              const isStudentAns = ans.id === q.studentAnswer
              return (
                <div
                  key={ans.id}
                  className={clsx(
                    'px-4 py-2.5 rounded-lg border text-sm font-body',
                    isCorrectAns
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold'
                      : isStudentAns && !isCorrectAns
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-surface-200 text-surface-600 bg-white'
                  )}
                >
                  <span className="font-bold mr-2">{letter}.</span>
                  {ans.answer_text}
                  {isCorrectAns && <span className="ml-2 text-emerald-600 text-xs font-bold">✓ Correct</span>}
                  {isStudentAns && !isCorrectAns && <span className="ml-2 text-red-500 text-xs font-bold">✗ Your answer</span>}
                </div>
              )
            })}
          </div>
          {q.rationale && (
            <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs font-body font-bold text-amber-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <BookOpen size={12} />
                Explanation
              </p>
              <p className="text-sm font-body text-amber-900 leading-relaxed">{q.rationale}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main QuizPage ─────────────────────────────────────────────────────────────

export default function QuizPage() {
  const { slug, moduleId } = useParams<{ slug: string; moduleId: string }>()
  const theme = COURSE_COLORS[slug ?? ''] ?? COURSE_COLORS['real-estate-foundation']

  // ── Shared state ──
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
  const [submitted, setSubmitted] = useState(false)

  // ── Exam mode state ──
  const [currentIdx, setCurrentIdx] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [timerStarted, setTimerStarted] = useState(false)
  const [showReview, setShowReview] = useState(false)

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', moduleId],
    queryFn: async (): Promise<Quiz> => {
      const res = await apiClient.get<Quiz>(`/student/modules/${moduleId}/quiz/`)
      return res.data
    },
    enabled: !!moduleId,
  })

  // ── Initialize timer when exam quiz loads ──
  useEffect(() => {
    if (quiz?.is_exam_mode && quiz.time_limit_minutes && !timerStarted) {
      setTimeLeft(quiz.time_limit_minutes * 60)
      setTimerStarted(true)
    }
  }, [quiz, timerStarted])

  // ── Countdown tick ──
  const handleAutoSubmit = useCallback(() => {
    if (!submitted) {
      submitMutation.mutate()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted])

  useEffect(() => {
    if (timeLeft === null || submitted) return
    if (timeLeft <= 0) {
      handleAutoSubmit()
      return
    }
    const id = setTimeout(() => setTimeLeft(t => (t !== null ? t - 1 : null)), 1000)
    return () => clearTimeout(id)
  }, [timeLeft, submitted, handleAutoSubmit])

  const submitMutation = useMutation({
    mutationFn: async (): Promise<QuizResult> => {
      const res = await apiClient.post<QuizResult>(
        `/student/modules/${moduleId}/quiz/attempt/`,
        { answers }
      )
      return res.data
    },
    onSuccess: (data) => {
      setResult(data)
      setSubmitted(true)
      setTimeLeft(null)
    },
  })

  const handleReset = () => {
    setAnswers({})
    setResult(null)
    setSubmitted(false)
    setCurrentIdx(0)
    setShowReview(false)
    if (quiz?.is_exam_mode && quiz.time_limit_minutes) {
      setTimeLeft(quiz.time_limit_minutes * 60)
    }
  }

  // ── Loading / empty states ──
  if (isLoading) {
    return (
      <div className="page-container max-w-2xl mx-auto py-10">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-24 bg-surface-200 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-4xl mb-4">📋</div>
          <h2 className="font-display text-xl font-bold text-navy-900 mb-2">No Quiz Available</h2>
          <p className="text-surface-500 font-body text-sm mb-6">This module doesn't have a quiz yet. Check back soon!</p>
          <Link to={`/courses/${slug}/progress`} className="btn-secondary text-sm py-2 px-4">
            <ArrowLeft size={15} />
            Back to course
          </Link>
        </div>
      </div>
    )
  }

  const totalQuestions = quiz.questions.length
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === totalQuestions
  const attemptsLeft = quiz.attempts_left
  const canRetry = (attemptsLeft === null || attemptsLeft > 0) && !result?.passed

  // ── Route to exam mode or standard mode ──
  if (quiz.is_exam_mode) {
    return (
      <ExamMode
        quiz={quiz}
        slug={slug ?? ''}
        theme={theme}
        answers={answers}
        setAnswers={setAnswers}
        result={result}
        submitted={submitted}
        currentIdx={currentIdx}
        setCurrentIdx={setCurrentIdx}
        timeLeft={timeLeft}
        showReview={showReview}
        setShowReview={setShowReview}
        canRetry={canRetry}
        onSubmit={() => submitMutation.mutate()}
        onReset={handleReset}
        isPending={submitMutation.isPending}
      />
    )
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // STANDARD QUIZ MODE (unchanged from original)
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-surface-200 px-4 py-3">
        <div className="page-container max-w-2xl mx-auto flex items-center justify-between">
          <Link
            to={`/courses/${slug}/progress`}
            className="flex items-center gap-2 text-surface-500 hover:text-surface-700 text-sm font-body"
          >
            <ArrowLeft size={15} />
            Back to course
          </Link>
          {!submitted && (
            <span className="text-sm font-body text-surface-400">
              {answeredCount} / {totalQuestions} answered
            </span>
          )}
        </div>
      </div>

      <div className="page-container max-w-2xl mx-auto py-10 px-4">

        {/* Quiz header */}
        <div className="mb-8">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-body font-semibold uppercase tracking-wider mb-3 text-white"
            style={{ background: theme.primary }}
          >
            Module Quiz
          </div>
          <h1 className="font-display text-2xl font-bold text-navy-900 mb-1">
            {submitted ? (result?.passed ? '🎉 You passed!' : 'Not quite — try again') : quiz.title}
          </h1>
          <p className="text-surface-500 font-body text-sm">
            {totalQuestions} questions · {quiz.passing_score}% to pass ·{' '}
            {attemptsLeft !== null
              ? `${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining`
              : 'Unlimited attempts'}
          </p>
        </div>

        {/* Result banner */}
        {submitted && result && (
          <div
            className={clsx(
              'rounded-xl p-6 mb-8 flex items-start gap-4',
              result.passed ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
            )}
          >
            {result.passed
              ? <Trophy size={24} className="text-emerald-600 flex-shrink-0 mt-0.5" />
              : <XCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
            }
            <div>
              <p className={clsx('font-body font-bold text-lg', result.passed ? 'text-emerald-700' : 'text-red-700')}>
                {result.score}% — {result.passed ? 'Passed' : `Need ${result.passing_score}% to pass`}
              </p>
              {result.certificate_issued && (
                <p className="text-sm font-body text-emerald-600 mt-1 font-semibold">
                  🎓 Certificate issued! Check your dashboard.
                </p>
              )}
              <div className="flex gap-3 mt-4">
                {result.passed ? (
                  <Link
                    to={`/courses/${slug}/progress`}
                    className="btn-primary text-sm py-2"
                    style={{ background: theme.primary }}
                  >
                    <CheckCircle size={15} />
                    Continue course
                  </Link>
                ) : canRetry ? (
                  <button onClick={handleReset} className="btn-secondary text-sm py-2">
                    <RotateCcw size={15} />
                    Try again
                  </button>
                ) : (
                  <Link to={`/courses/${slug}/progress`} className="btn-secondary text-sm py-2">
                    Back to course
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Questions */}
        {!submitted && (
          <>
            <div className="space-y-6">
              {quiz.questions.map((q, qIdx) => (
                <div key={q.id} className="card p-6">
                  <p className="font-body font-semibold text-navy-900 mb-4">
                    <span style={{ color: theme.mid }} className="font-bold">{qIdx + 1}.</span>{' '}
                    {q.question_text}
                  </p>
                  <div className="space-y-2">
                    {q.answers.map((ans, ansIdx) => {
                      const letter = String.fromCharCode(65 + ansIdx)
                      const isSelected = answers[q.id] === ans.id
                      const isCorrect = result?.correct_answers?.[q.id] === ans.id
                      return (
                        <button
                          key={ans.id}
                          onClick={() => !submitted && setAnswers(prev => ({ ...prev, [q.id]: ans.id }))}
                          disabled={submitted}
                          className={clsx(
                            'w-full text-left px-4 py-3 rounded-lg border text-sm font-body transition-all duration-150',
                            submitted && isCorrect
                              ? 'border-emerald-400 bg-emerald-50 text-emerald-800 font-semibold'
                              : submitted && isSelected && !isCorrect
                              ? 'border-red-400 bg-red-50 text-red-700'
                              : isSelected
                              ? 'border-2 font-semibold'
                              : 'border-surface-200 text-surface-700 hover:border-surface-300 bg-white'
                          )}
                          style={!submitted && isSelected ? {
                            borderColor: theme.primary,
                            background: `${theme.pale}`,
                            color: theme.primary,
                          } : {}}
                        >
                          <span className="font-semibold mr-2">{letter}.</span>
                          {ans.answer_text}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Submit */}
            <div className="mt-8 flex justify-between items-center">
              <p className="text-sm text-surface-400 font-body">
                {allAnswered
                  ? 'All questions answered — ready to submit!'
                  : `${totalQuestions - answeredCount} question${totalQuestions - answeredCount !== 1 ? 's' : ''} remaining`}
              </p>
              <button
                onClick={() => submitMutation.mutate()}
                disabled={!allAnswered || submitMutation.isPending}
                className="btn-primary py-2.5 px-6"
                style={allAnswered ? { background: theme.primary } : {}}
              >
                {submitMutation.isPending ? 'Submitting...' : 'Submit quiz'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXAM MODE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface ExamModeProps {
  quiz: Quiz
  slug: string
  theme: { primary: string; mid: string; pale: string }
  answers: Record<string, string>
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>
  result: QuizResult | null
  submitted: boolean
  currentIdx: number
  setCurrentIdx: React.Dispatch<React.SetStateAction<number>>
  timeLeft: number | null
  showReview: boolean
  setShowReview: React.Dispatch<React.SetStateAction<boolean>>
  canRetry: boolean
  onSubmit: () => void
  onReset: () => void
  isPending: boolean
}

function ExamMode({
  quiz, slug, theme, answers, setAnswers,
  result, submitted, currentIdx, setCurrentIdx,
  timeLeft, showReview, setShowReview,
  canRetry, onSubmit, onReset, isPending,
}: ExamModeProps) {
  const totalQuestions = quiz.questions.length
  const currentQuestion = quiz.questions[currentIdx]
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === totalQuestions

  // ── Results screen ──
  if (submitted && result) {
    return (
      <div className="min-h-screen bg-surface-50">
        <div className="sticky top-16 z-40 bg-white border-b border-surface-200 px-4 py-3">
          <div className="page-container max-w-3xl mx-auto flex items-center justify-between">
            <Link
              to={`/courses/${slug}/progress`}
              className="flex items-center gap-1.5 text-surface-500 hover:text-surface-700 text-sm font-body"
            >
              <ArrowLeft size={14} />
              Back to course
            </Link>
            <span className="text-sm font-body text-surface-400 font-semibold">
              Exam Results
            </span>
            <div className="w-24" />
          </div>
        </div>

        <div className="page-container max-w-3xl mx-auto py-10 px-4">

          {/* Score banner */}
          <div
            className={clsx(
              'rounded-2xl p-8 mb-8 text-center',
              result.passed
                ? 'bg-emerald-50 border-2 border-emerald-200'
                : 'bg-surface-50 border-2 border-surface-200'
            )}
          >
            <div className="text-5xl mb-3">{result.passed ? '🎉' : '📚'}</div>
            <div
              className={clsx(
                'font-display text-5xl font-bold mb-2',
                result.passed ? 'text-emerald-700' : 'text-navy-900'
              )}
            >
              {result.score}%
            </div>
            <p className={clsx(
              'font-body text-lg font-semibold mb-1',
              result.passed ? 'text-emerald-700' : 'text-red-600'
            )}>
              {result.passed ? 'Passed' : `Did not pass — need ${result.passing_score}% to pass`}
            </p>
            <p className="font-body text-sm text-surface-500">
              {Object.values(result.correct_answers).length > 0
                ? `${Math.round(result.score / 100 * totalQuestions)} of ${totalQuestions} questions correct`
                : `${totalQuestions} questions`}
            </p>
            {result.certificate_issued && (
              <p className="mt-3 text-sm font-body text-emerald-600 font-semibold">
                🎓 Certificate issued! Check your dashboard.
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 justify-center mt-6">
              {result.passed ? (
                <Link
                  to={`/courses/${slug}/progress`}
                  className="btn-primary text-sm py-2.5 px-5"
                  style={{ background: theme.primary }}
                >
                  <CheckCircle size={15} />
                  Continue course
                </Link>
              ) : canRetry ? (
                <button onClick={onReset} className="btn-secondary text-sm py-2.5 px-5">
                  <RotateCcw size={15} />
                  Retake exam
                </button>
              ) : null}
              <button
                onClick={() => setShowReview(v => !v)}
                className="btn-secondary text-sm py-2.5 px-5"
              >
                <BookOpen size={15} />
                {showReview ? 'Hide review' : 'Review all questions'}
              </button>
            </div>
          </div>

          {/* Per-section breakdown */}
          {result.section_breakdown && result.section_breakdown.length > 0 && (
            <SectionBreakdownTable
              breakdown={result.section_breakdown}
              passingScore={quiz.passing_score}
            />
          )}

          {/* Post-exam review */}
          {showReview && (
            <div className="mt-8">
              <h3 className="font-display font-bold text-navy-900 text-lg mb-4">
                Question Review
              </h3>
              <div className="space-y-3">
                {quiz.questions.map((q, idx) => (
                  <ReviewItem
                    key={q.id}
                    idx={idx}
                    q={{
                      id: q.id,
                      question_text: q.question_text,
                      answers: q.answers,
                      studentAnswer: answers[q.id],
                      correctAnswer: result.correct_answers[q.id],
                      rationale: result.rationales?.[q.id],
                      section: q.section,
                    }}
                    themeColor={theme.primary}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── One-question-per-page exam view ──
  if (!currentQuestion) return null

  const isFirst = currentIdx === 0
  const isLast = currentIdx === totalQuestions - 1

  return (
    <div className="min-h-screen bg-surface-50">
      <ExamHeader
        slug={slug}
        current={currentIdx + 1}
        total={totalQuestions}
        timeLeft={timeLeft}
        timeLimitMinutes={quiz.time_limit_minutes}
        themeColor={theme.primary}
      />

      <div className="page-container max-w-2xl mx-auto py-10 px-4">

        {/* Section label */}
        {currentQuestion.section && (
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-body font-semibold uppercase tracking-wider mb-4 text-white"
            style={{ background: theme.primary }}
          >
            {currentQuestion.section.replace(/_/g, ' ')}
          </div>
        )}

        {/* Question card */}
        <div className="card p-6 mb-6">
          <p className="font-body font-semibold text-navy-900 text-base leading-relaxed mb-5">
            <span style={{ color: theme.mid }} className="font-bold mr-1">{currentIdx + 1}.</span>
            {currentQuestion.question_text}
          </p>
          <div className="space-y-2.5">
            {currentQuestion.answers.map((ans, ansIdx) => {
              const letter = String.fromCharCode(65 + ansIdx)
              const isSelected = selectedAnswer === ans.id
              return (
                <button
                  key={ans.id}
                  onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: ans.id }))}
                  className={clsx(
                    'w-full text-left px-4 py-3.5 rounded-xl border text-sm font-body transition-all duration-150',
                    isSelected
                      ? 'border-2 font-semibold'
                      : 'border-surface-200 text-surface-700 hover:border-surface-300 bg-white'
                  )}
                  style={isSelected ? {
                    borderColor: theme.primary,
                    background: theme.pale,
                    color: theme.primary,
                  } : {}}
                >
                  <span className="font-bold mr-2">{letter}.</span>
                  {ans.answer_text}
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
            disabled={isFirst}
            className="btn-secondary text-sm py-2.5 px-4 disabled:opacity-40"
          >
            <ArrowLeft size={15} />
            Previous
          </button>

          <div className="text-xs font-body text-surface-400 text-center">
            {answeredCount} of {totalQuestions} answered
          </div>

          {isLast ? (
            <button
              onClick={onSubmit}
              disabled={!allAnswered || isPending}
              className="btn-primary text-sm py-2.5 px-5 disabled:opacity-50"
              style={allAnswered ? { background: theme.primary } : {}}
            >
              {isPending ? 'Submitting...' : 'Submit exam'}
              <CheckCircle size={15} />
            </button>
          ) : (
            <button
              onClick={() => setCurrentIdx(i => Math.min(totalQuestions - 1, i + 1))}
              className="btn-primary text-sm py-2.5 px-4"
              style={{ background: theme.primary }}
            >
              Next
              <ArrowRight size={15} />
            </button>
          )}
        </div>

        {/* Unanswered warning on last question */}
        {isLast && !allAnswered && (
          <p className="mt-4 text-center text-sm font-body text-amber-600">
            ⚠️ {totalQuestions - answeredCount} question{totalQuestions - answeredCount !== 1 ? 's' : ''} unanswered — go back to complete them before submitting.
          </p>
        )}
      </div>
    </div>
  )
}
