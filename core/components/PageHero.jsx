'use client'

import { colors } from '@/core/theme'

/**
 * Page hero band — matches tntaiaudit guild/audit page headers.
 */
export default function PageHero({
  chip,
  chipColor = colors.accent,
  title,
  description,
  badges = [],
  children,
  gradientColor = colors.accent,
  actions,
  maxWidth = 'max-w-3xl',
}) {
  const gradientAlpha = gradientColor === colors.warning ? '0d' : gradientColor === colors.neonPurple ? '0f' : '0a'

  return (
    <div
      className="w-full border-b border-white/[0.07] px-6 md:px-8 lg:px-10 pt-5 md:pt-8 pb-4 md:pb-6"
      style={{
        background: `linear-gradient(180deg, ${gradientColor}${gradientAlpha} 0%, transparent 100%)`,
      }}
    >
      <div className={`${maxWidth} w-full`}>
        {chip && (
          <span
            className="inline-block mb-4 text-[0.7rem] font-semibold px-2.5 py-1 rounded-md border"
            style={{
              color: chipColor,
              borderColor: `${chipColor}44`,
              background: `${chipColor}18`,
            }}
          >
            {chip}
          </span>
        )}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <h1
              className="text-[2rem] sm:text-[2.75rem] md:text-[3.25rem] font-bold tracking-[-0.02em] text-[#f1f5f9] mb-3 leading-[1.15]"
            >
              {title}
            </h1>
            {description && (
              <p className="text-[0.95rem] sm:text-[1.05rem] text-muted-foreground max-w-[600px] leading-[1.7] mb-4">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {badges.map(({ label, icon: Icon, color = colors.accent }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-[0.7rem] font-bold text-[#f1f5f9]"
                style={{
                  borderColor: `${color}40`,
                  background: `${color}12`,
                }}
              >
                {Icon && <Icon className="w-3 h-3 shrink-0" style={{ color }} />}
                {label}
              </div>
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
