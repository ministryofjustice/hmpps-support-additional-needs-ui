import type { StrengthDto } from 'dto'

const aValidStrengthDto = (options?: {
  prisonNumber?: string
  prisonId?: string
  strengthTypeCode?: string
  detail?: string
}): StrengthDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
  strengthTypeCode: options?.strengthTypeCode || 'READING',
  detail: options?.detail === null ? null : options?.detail || 'John is a very accomplished reader.',
})

export default aValidStrengthDto
