'use client'

import { colors } from '@/core/theme'

const ROLE_META = [
  { key: 'tanks', label: 'Tanks', color: colors.success },
  { key: 'healers', label: 'Healers', color: colors.accent },
  { key: 'dps', label: 'DPS', color: '#ef4444' },
]

export default function RolePulseChart({ tanks = 0, healers = 0, dps = 0 }) {
  const total = tanks + healers + dps || 1
  const segments = [
    { value: tanks, color: colors.success },
    { value: healers, color: colors.accent },
    { value: dps, color: '#ef4444' },
  ]

  let cumulative = 0
  const gradientStops = segments
    .map(({ value, color }) => {
      const start = cumulative
      cumulative += (value / total) * 100
      return `${color} ${start}% ${cumulative}%`
    })
    .join(', ')

  const counts = { tanks, healers, dps }

  return (
    <div className="audit-panel p-5 dashboard-fade-in">
      <p className="text-[0.67rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground mb-4">
        Role composition
      </p>
      <div className="flex items-center gap-6">
        <div
          className="w-24 h-24 rounded-full shrink-0 dashboard-pulse-ring"
          style={{
            background: `conic-gradient(${gradientStops})`,
            boxShadow: `0 0 24px ${colors.accent}22`,
          }}
        />
        <div className="flex-1 grid grid-cols-3 gap-2">
          {ROLE_META.map(({ key, label, color }) => (
            <div key={key} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center">
              <p className="text-[0.65rem] text-muted-foreground uppercase tracking-wide">{label}</p>
              <p className="text-xl font-bold stat-number mt-1" style={{ color }}>{counts[key]}</p>
              <p className="text-[0.65rem] text-muted-foreground">
                {Math.round((counts[key] / total) * 100)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
