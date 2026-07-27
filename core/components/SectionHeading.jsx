import { colors } from '@/core/theme'

/**
 * Section heading with icon box — matches tntaiaudit SectionHeading.
 */
export default function SectionHeading({ icon: Icon, label, color = colors.accent, className = '' }) {
  return (
    <div className={`flex items-center gap-3 mb-4 ${className}`}>
      <div
        className="flex items-center justify-center w-7 h-7 rounded-md shrink-0"
        style={{
          background: `${color}1f`,
          border: `1px solid ${color}33`,
        }}
      >
        {Icon && <Icon className="w-3.5 h-3.5" style={{ color }} />}
      </div>
      <h2 className="text-[0.95rem] font-semibold text-foreground tracking-tight">{label}</h2>
    </div>
  )
}
