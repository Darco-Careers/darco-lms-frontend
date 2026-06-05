import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, ArrowLeft } from 'lucide-react'
import { glossaryApi } from '@/api/glossary'
import { coursesApi } from '@/api/courses'
import { COURSE_COLORS } from '@/types'

export default function GlossaryPage() {
  const { slug } = useParams<{ slug: string }>()
  const theme = COURSE_COLORS[slug ?? ''] ?? COURSE_COLORS['real-estate-foundation']
  const [search, setSearch] = useState('')
  const [activeLetter, setActiveLetter] = useState<string | null>(null)

  const { data: terms = [], isLoading } = useQuery({
    queryKey: ['glossary', slug],
    queryFn: () => glossaryApi.list(slug!),
    enabled: !!slug,
    staleTime: 60 * 60 * 1000,
  })

  const { data: course } = useQuery({
    queryKey: ['course', slug],
    queryFn: () => coursesApi.detail(slug!),
    enabled: !!slug,
  })

  const filtered = useMemo(() => {
    let list = terms
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(t => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q))
    }
    if (activeLetter) {
      list = list.filter(t => t.term.toUpperCase().startsWith(activeLetter))
    }
    return list
  }, [terms, search, activeLetter])

  // Group by first letter
  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {}
    for (const term of filtered) {
      const letter = term.term.charAt(0).toUpperCase()
      if (!map[letter]) map[letter] = []
      map[letter].push(term)
    }
    return map
  }, [filtered])

  const availableLetters = Object.keys(grouped).sort()
  const allLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="page-container py-10">
      {/* Header */}
      <div
        className="rounded-xl p-6 mb-8 relative overflow-hidden"
        style={{ background: theme.heroGradient }}
      >
        <Link
          to={`/courses/${slug}/progress`}
          className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-body mb-4 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to course
        </Link>
        <h1 className="font-display text-2xl font-bold text-white mb-1">
          {course?.title} — Glossary
        </h1>
        <p className="text-white/60 font-body text-sm">
          {terms.length} terms · Alphabetical
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          className="input-field pl-10"
          placeholder="Search terms or definitions..."
          value={search}
          onChange={e => { setSearch(e.target.value); setActiveLetter(null) }}
        />
      </div>

      {/* Alphabet filter */}
      {!search && (
        <div className="flex flex-wrap gap-1.5 mb-8">
          <button
            onClick={() => setActiveLetter(null)}
            className={`text-xs font-body font-semibold px-2.5 py-1 rounded-lg transition-colors ${
              activeLetter === null
                ? 'text-white'
                : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
            }`}
            style={activeLetter === null ? { background: theme.primary } : {}}
          >
            All
          </button>
          {allLetters.map(letter => {
            const hasTerms = availableLetters.includes(letter)
            return (
              <button
                key={letter}
                onClick={() => hasTerms && setActiveLetter(letter === activeLetter ? null : letter)}
                disabled={!hasTerms}
                className={`text-xs font-body font-semibold w-8 h-8 rounded-lg transition-colors ${
                  letter === activeLetter
                    ? 'text-white'
                    : hasTerms
                    ? 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    : 'text-surface-200 cursor-default'
                }`}
                style={letter === activeLetter ? { background: theme.primary } : {}}
              >
                {letter}
              </button>
            )
          })}
        </div>
      )}

      {isLoading && (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-16 bg-surface-100 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-12 text-surface-400 font-body">
          No terms found for "{search}"
        </div>
      )}

      {/* Term groups */}
      {!isLoading && Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([letter, letterTerms]) => (
          <div key={letter} className="mb-8">
            <div
              className="inline-flex items-center justify-center w-9 h-9 rounded-lg font-display font-bold text-white mb-4"
              style={{ background: theme.primary }}
            >
              {letter}
            </div>
            <div className="space-y-2">
              {letterTerms.map(term => (
                <div key={term.id} className="card p-4">
                  <p className="font-body font-bold text-navy-900 text-sm mb-1">{term.term}</p>
                  <p className="text-surface-500 font-body text-sm leading-relaxed">{term.definition}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      }
    </div>
  )
}
