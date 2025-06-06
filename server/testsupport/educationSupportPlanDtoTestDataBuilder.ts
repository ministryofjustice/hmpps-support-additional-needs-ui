import type { EducationSupportPlanDto } from 'dto'

const aValidEducationSupportPlanDto = (options?: {
  prisonNumber?: string
  prisonId?: string
}): EducationSupportPlanDto => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
})

export default aValidEducationSupportPlanDto
