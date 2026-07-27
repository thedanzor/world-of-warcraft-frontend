/**
 * Design tokens aligned with tntaiaudit theme.
 */
export const colors = {
  accent: '#3b82f6',
  accentLt: '#60a5fa',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  surface: '#0f1923',
  surfaceLight: '#162030',
  bg: '#090f18',
  border: 'rgba(255,255,255,0.07)',
  borderHover: 'rgba(255,255,255,0.14)',
  textPrimary: '#f1f5f9',
  textSecondary: 'rgba(241,245,249,0.55)',
  neonPurple: '#818cf8',
}

export const tiers = {
  mythic: { label: 'Mythic', color: '#e6cc80', stars: 5 },
  legendary: { label: 'Legendary', color: '#ff8000', stars: 4 },
  epic: { label: 'Epic', color: '#a335ee', stars: 3 },
  rare: { label: 'Rare', color: '#0070dd', stars: 2 },
  uncommon: { label: 'Uncommon', color: '#1eff00', stars: 1 },
}

export function raidScoreColour(score) {
  if (score >= 150) return '#e6cc80'
  if (score >= 125) return '#ff8000'
  if (score >= 110) return '#a335ee'
  if (score >= 100) return '#0070dd'
  if (score >= 75) return '#1eff00'
  return '#9d9d9d'
}

export function mplusScoreColour(score) {
  if (score >= 130) return '#e6cc80'
  if (score >= 110) return '#ff8000'
  if (score >= 80) return '#a335ee'
  if (score >= 50) return '#0070dd'
  if (score >= 20) return '#1eff00'
  return '#9d9d9d'
}

export function tierForRank(rank) {
  if (rank === 1) return 'mythic'
  if (rank <= 3) return 'legendary'
  if (rank <= 7) return 'epic'
  if (rank <= 12) return 'rare'
  return 'uncommon'
}
