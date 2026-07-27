'use client'

import { colors } from '@/core/theme'

export default function AnimatedMetric({
  title,
  value,
  subtitle,
  icon: Icon,
  color = colors.accent,
  delay = 0,
}) {
  return (
    <div
      className="audit-panel overflow-hidden dashboard-fade-in group hover:border-white/[0.14] transition-colors"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="p-5 relative">
        <div
          className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{ background: `radial-gradient(circle, ${color}18 0%, transparent 70%)` }}
        />
        <div className="flex items-start justify-between mb-3">
          <p className="text-[0.67rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            {title}
          </p>
          <div
            className="flex items-center justify-center w-8 h-8 rounded-md"
            style={{ background: `${color}1a`, border: `1px solid ${color}33` }}
          >
            <Icon className="w-4 h-4" style={{ color }} />
          </div>
        </div>
        <p className="stat-number text-[2rem] leading-none dashboard-count-up" style={{ color }}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
