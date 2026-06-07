import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react'
import { apiClient } from '@/api/client'
import { COURSE_COLORS } from '@/types'
import type { Quiz, QuizResult } from '@/types'
import clsx from 'clsx'

export default function QuizPage() {
  const { slug, moduleId } = useParams<{ slug: string; moduleId: string }>()
  const theme = COURSE_COLORS[slug ?? ''] ?? COURSE_COLORS['real-estate-foundation']

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<QuizResult | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const { data: quiz, isLoading } = useQuery({
    queryKey: ['quiz', moduleId],
    queryFn: async (): Promise<Quiz> => {
      const res = await apiClient.get<Quiz>(`/modules/${moduleId}/quiz/`)
      return res.data
    },
    enabled: !!moduleId,
  })

  const submitMutation = useMutation({
    mutationFn: async (): Promise<QuizResult> => {
      const res = await apiClient.post<QuizResult>(
        `/modules/${moduleId}/quiz/attempt/`,
        { answers }
      )
      return res.data
    },
    onSuccess: (data) => {
      setResult(data)
      setSubmitted(true)
    },
  })

  const handleReset = () => {
    setAnswers({})
    setResult(null)
    setSubmitted(false)
  }

  const answeredCount = Object.keys(answers).length
  const allAnswered = quiz ? answeredCount === quiz.questions.length : false
  const attemptsUsed = quiz?.attempts_used ?? 0
  const attemptsLeft = quiz?.attempts_left ?? 0
  const canRetry = attemptsLeft > 0 && !result?.passed

  if (isLoading) {
    return (
      <div className="page-container max-w-2xl mx-auto py-10">
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-surface-200 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (!quiz) return null

  const totalQuestions = quiz.questions.length

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
            {attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} remaining
          </p>
        </div>

        {/* Result banner */}
        {submitted && result && (
          <div
            className={clsx(
              'rounded-xl p-6 mb-8 flex items-start gap-4',
              result.passed
                ? 'bg-emerald-50 border border-emerald-200'
                : 'bg-red-50 border border-red-200'
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
                      const letter = String.fromCharCode(65 + ansIdx) // A, B, C, D
                      const isSelected = answers[q.id] === ans.id
                      // Show correct/incorrect after submission
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
