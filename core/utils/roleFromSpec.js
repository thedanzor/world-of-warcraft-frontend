const DEFAULT_TANK_SPECS = ['Blood', 'Vengeance', 'Guardian', 'Brewmaster', 'Protection']
const DEFAULT_HEALER_SPECS = ['Preservation', 'Mistweaver', 'Holy', 'Discipline', 'Restoration']

const TANK_ALIASES = ['prot', 'protection', 'blood', 'bdk', 'vengeance', 'vdh', 'guardian', 'bear', 'brewmaster', 'brm']
const HEALER_ALIASES = ['holy', 'discipline', 'disc', 'restoration', 'resto', 'mistweaver', 'mw', 'preservation', 'pres']

const normalizeText = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const getSpecString = (value) => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    if (typeof value.name === 'string') return value.name
    if (typeof value.spec === 'string') return value.spec
    if (typeof value.value === 'string') return value.value
  }
  return String(value)
}

const roleFromRawValue = (value) => {
  const role = normalizeText(value)
  if (!role) return null
  if (['tank', 'tanks'].includes(role)) return 'tank'
  if (['healer', 'healers', 'heal', 'heals'].includes(role)) return 'healer'
  if (['dps', 'damage', 'damager', 'damagers', 'ranged', 'melee'].includes(role)) return 'dps'
  return null
}

const containsAnyToken = (tokens, values) =>
  values.some((value) => tokens.has(normalizeText(value)))

/**
 * Derive role (tank/healer/dps) from character spec.
 *
 * @param {string | { name?: string, spec?: string, value?: string }} spec
 * @param {{ TANKS?: string[], HEALERS?: string[] } | undefined} config
 * @returns {'tank'|'healer'|'dps'}
 */
export function getRoleFromSpec(spec, config) {
  const rawSpec = getSpecString(spec)
  const normalizedSpec = normalizeText(rawSpec)
  if (!normalizedSpec) return 'dps'

  const tokens = new Set(normalizedSpec.split(' '))
  const firstToken = normalizedSpec.split(' ')[0]

  const tanks = Array.isArray(config?.TANKS) ? config.TANKS : DEFAULT_TANK_SPECS
  const healers = Array.isArray(config?.HEALERS) ? config.HEALERS : DEFAULT_HEALER_SPECS

  const isTank = containsAnyToken(tokens, [...tanks, ...TANK_ALIASES]) || TANK_ALIASES.includes(firstToken)
  const isHealer = containsAnyToken(tokens, [...healers, ...HEALER_ALIASES]) || HEALER_ALIASES.includes(firstToken)

  return isTank ? 'tank' : isHealer ? 'healer' : 'dps'
}

/**
 * Get role for a character: use role fields if available, otherwise derive from best spec field.
 *
 * @param {{
 *  spec?: string | { name?: string, spec?: string, value?: string },
 *  specialization?: string,
 *  activeSpec?: string | { name?: string },
 *  active_spec?: string | { name?: string },
 *  metaData?: { role?: string, primary_role?: string, spec?: string | { name?: string } }
 * }} character
 * @param {{ TANKS?: string[], HEALERS?: string[] } | undefined} config
 * @returns {'tank'|'healer'|'dps'}
 */
export function getCharacterRole(character, config) {
  const specCandidate =
    character?.spec ??
    character?.metaData?.spec ??
    character?.specialization ??
    character?.metaData?.specialization ??
    character?.primarySpec ??
    character?.primary_spec ??
    character?.activeSpec ??
    character?.active_spec

  // Spec is the source of truth for raid role classification.
  const specRole = getRoleFromSpec(specCandidate, config)
  if (specCandidate && String(getSpecString(specCandidate)).trim()) {
    return specRole
  }

  const normalizedRole =
    roleFromRawValue(character?.metaData?.role) ||
    roleFromRawValue(character?.metaData?.primary_role) ||
    roleFromRawValue(character?.role) ||
    roleFromRawValue(character?.primary_role)

  return normalizedRole || 'dps'
}
