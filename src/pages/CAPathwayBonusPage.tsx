/**
 * CAPathwayBonusPage
 * ==================
 * End-of-track bonus intro page for the California DRE Licensing Pathway.
 * Rendered after the final module of any track that bundles CA Pathway access
 * (currently: Mortgage & Lending, Residential Agent).
 *
 * Color approach:
 * - Page background = host track color (MLO purple, Agent teal) — feels like
 *   a natural continuation of the track just completed.
 * - Bonus CTA card = deep midnight navy (#0F1B2D) with gold (#C9A84C) accents
 *   — visually pops against the surrounding track color, reads as "something special."
 * - Clicking CTA → CA Pathway course page, which has its own gold-navy identity.
 *
 * Parameterized by hostSlug (the track that bundles CA Pathway).
 * Track-specific copy is handled via the TRACK_COPY map below.
 */

import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, ArrowLeft, Star } from 'lucide-react'
import { COURSE_COLORS } from '@/types'
import { useTrackThemeStore } from '@/store/trackThemeStore'
import { useEffect } from 'react'

// ── Track-specific copy ─────────────────────────────────────────────────────
interface TrackCopy {
  trackLabel: string
  headlineEmphasis: string  // the part rendered in italic gold
  headlineRest: string      // the rest of the headline
  bodyLine: string          // the one track-specific sentence
}

const TRACK_COPY: Record<string, TrackCopy> = {
  'real-estate-mortgage-lending': {
    trackLabel: 'MORTGAGE & LENDING TRACK · BONUS PROGRAM',
    headlineEmphasis: 'Originate loans AND sell real estate',
    headlineRest: ' — with one California license.',
    bodyLine:
      'In California, a DRE license plus MLO endorsement lets you work under both brokers and lending companies — the most versatile position in the state.',
  },
  'real-estate-residential-agent': {
    trackLabel: 'RESIDENTIAL AGENT TRACK · BONUS PROGRAM',
    headlineEmphasis: 'Get your DRE license the right way',
    headlineRest: ' — with a full exam simulator included.',
    bodyLine:
      'In California, the DRE license is your entry point to the residential market. This pathway covers every step from pre-license education through exam day.',
  },
}

const DEFAULT_COPY: TrackCopy = {
  trackLabel: 'BONUS PROGRAM',
  headlineEmphasis: 'Go further in California',
  headlineRest: ' — the DRE license opens every door.',
  bodyLine:
    'The California DRE license is one of the most versatile credentials in real estate. This pathway covers the license, the endorsement, and a full 150-question exam simulator.',
}

// ── Component ───────────────────────────────────────────────────────────────
export default function CAPathwayBonusPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const setTrackTheme = useTrackThemeStore((s) => s.setTrackTheme)

  const hostSlug = slug ?? ''
  const theme = COURSE_COLORS[hostSlug] ?? null
  const copy = TRACK_COPY[hostSlug] ?? DEFAULT_COPY

  // Apply host track theme to nav/header
  useEffect(() => {
    setTrackTheme(hostSlug)
    return () => setTrackTheme(null)
  }, [hostSlug, setTrackTheme])

  // Host track gradient — same as the track's heroGradient
  const pageBg = theme?.heroGradient ?? 'linear-gradient(135deg, #220E40 0%, #3D1A6E 55%, #5430A0 100%)'
  const primaryColor = theme?.primary ?? '#3D1A6E'

  // Gold palette
  const GOLD = '#C9A84C'
  const GOLD_LIGHT = '#E8C97A'
  const NAVY_DEEP = '#0F1B2D'
  const NAVY_MID = '#1A2E45'

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: pageBg }}
    >
      {/* ── Top nav strip ─────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b border-white/10"
        style={{ background: 'rgba(0,0,0,0.25)' }}
      >
        <button
          onClick={() => navigate(`/courses/${hostSlug}`)}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-body transition-colors"
        >
          <ArrowLeft size={15} />
          Back to track overview
        </button>
        <span className="text-white/40 text-xs font-body tracking-widest uppercase">
          Bonus Program
        </span>
      </div>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">

        {/* Track label badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body font-semibold tracking-widest uppercase mb-8"
          style={{
            background: 'rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.75)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Star size={11} fill="currentColor" />
          {copy.trackLabel}
        </div>

        {/* Headline */}
        <h1 className="text-center font-heading font-bold text-4xl md:text-5xl text-white mb-6 max-w-2xl leading-tight">
          <em style={{ color: GOLD_LIGHT, fontStyle: 'italic' }}>
            {copy.headlineEmphasis}
          </em>
          {copy.headlineRest}
        </h1>

        {/* Subheading — shared across tracks */}
        <p className="text-center text-white/70 font-body text-lg mb-4 max-w-xl leading-relaxed">
          You've completed the track. Your enrollment includes one more thing — a full
          California DRE licensing course, built into your access at no extra cost.
        </p>

        {/* Track-specific line */}
        <p className="text-center text-white/55 font-body text-base mb-12 max-w-lg leading-relaxed">
          {copy.bodyLine}
        </p>

        {/* ── Gold CTA card ──────────────────────────────────────────── */}
        <div
          className="w-full max-w-lg rounded-2xl p-8 flex flex-col gap-6"
          style={{
            background: `linear-gradient(135deg, ${NAVY_DEEP} 0%, ${NAVY_MID} 100%)`,
            border: `1px solid ${GOLD}40`,
            boxShadow: `0 0 40px ${GOLD}20, 0 8px 32px rgba(0,0,0,0.4)`,
          }}
        >
          {/* Card label */}
          <div className="flex items-center gap-2">
            <div
              className="w-1 h-8 rounded-full"
              style={{ background: GOLD }}
            />
            <div>
              <p
                className="text-xs font-body font-semibold tracking-widest uppercase"
                style={{ color: GOLD }}
              >
                California · Bonus Program
              </p>
              <p className="text-white font-heading font-bold text-xl mt-0.5">
                DRE Licensing Pathway
              </p>
            </div>
          </div>

          {/* What's included */}
          <div className="grid grid-cols-2 gap-3">
            {[
              ['4 Modules', 'License to endorsement'],
              ['150 Questions', 'Full exam simulator'],
              ['Step-by-step', 'Application walkthrough'],
              ['Included', 'No extra cost'],
            ].map(([stat, label]) => (
              <div
                key={stat}
                className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <p className="font-heading font-bold text-lg" style={{ color: GOLD_LIGHT }}>{stat}</p>
                <p className="text-white/55 text-xs font-body mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={() => navigate('/courses/california-licensing-pathway')}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-body font-bold text-base transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${GOLD} 0%, ${GOLD_LIGHT} 100%)`,
              color: NAVY_DEEP,
              boxShadow: `0 4px 20px ${GOLD}50`,
            }}
          >
            Enter the DRE Licensing Course
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Skip link */}
        <button
          onClick={() => navigate(`/courses/${hostSlug}/progress`)}
          className="mt-8 text-white/40 hover:text-white/70 text-sm font-body transition-colors"
        >
          Skip — view my track progress →
        </button>
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 py-3 border-t border-white/10 z-40"
        style={{ background: `${primaryColor}F0`, backdropFilter: 'blur(12px)' }}
      >
        <button
          onClick={() => navigate(`/courses/${hostSlug}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-body font-semibold text-sm text-white/70 hover:text-white transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.2)' }}
        >
          <ArrowLeft size={14} />
          Track Overview
        </button>

        <button
          onClick={() => navigate('/courses/california-licensing-pathway')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-body font-semibold text-sm transition-all hover:opacity-80"
          style={{
            background: GOLD,
            color: NAVY_DEEP,
          }}
        >
          Enter DRE Licensing Course
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Spacer for fixed bottom bar */}
      <div className="h-16" />
    </div>
  )
}
