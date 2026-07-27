/**
 * Page shell — matches tntaiaudit per-page layout (min-height + content container).
 */
export function PageShell({ children, className = '' }) {
  return (
    <div className={`min-h-[calc(100vh-3.5rem)] ${className}`}>
      {children}
    </div>
  )
}

export function PageContent({ children, className = '' }) {
  return (
    <div className={`px-6 md:px-8 py-6 md:py-8 ${className}`}>
      {children}
    </div>
  )
}
