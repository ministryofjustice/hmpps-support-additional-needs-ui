/**
 * Consolidation of the "how was this challenge/strength identified?" reason list (RR-2788).
 *
 * The reason list was reduced from 8 options to 5. The 5 retained options reuse existing enum
 * values, so no new enum values are introduced. Three values are deprecated: they are no longer
 * offered on any form, but are retained in the enums/filters so existing records still display,
 * and are mapped to their consolidated equivalent when an old record is edited.
 *
 * Both ChallengeIdentificationSource and StrengthIdentificationSource share the same string values,
 * so these helpers operate on strings and serve both.
 */

const CONSOLIDATION_MAP: Record<string, string> = {
  CONVERSATIONS: 'SELF_DISCLOSURE',
  COLLEAGUE_INFO: 'FORMAL_PROCESSES',
  OTHER_SCREENING_TOOL: 'FORMAL_PROCESSES',
}

export const DEPRECATED_IDENTIFICATION_SOURCES: ReadonlyArray<string> = Object.keys(CONSOLIDATION_MAP)

/**
 * Maps an array of stored identification sources to the consolidated set. Deprecated values are
 * remapped to their equivalent; retained values are left unchanged. The result is de-duplicated
 * (e.g. COLLEAGUE_INFO + FORMAL_PROCESSES collapse to a single FORMAL_PROCESSES) whilst preserving
 * first-seen order.
 */
export const consolidateIdentificationSources = <T extends string>(values: Array<T> = []): Array<T> => [
  ...new Set(values.map(value => (CONSOLIDATION_MAP[value] ?? value) as T)),
]

/**
 * True if any of the given identification sources is a deprecated value. Drives the "we have mapped
 * the original selection" warning shown when editing a pre-consolidation record.
 */
export const containsDeprecatedIdentificationSource = (values: Array<string> = []): boolean =>
  values.some(value => DEPRECATED_IDENTIFICATION_SOURCES.includes(value))
