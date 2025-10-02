import type { PrisonerSearchSummary } from 'viewModels'
import SentenceType from '../enums/sentenceType'
import PlanActionStatus from '../enums/planActionStatus'

const aValidPrisonerSearchSummary = (options?: {
  prisonNumber?: string
  prisonId?: string
  firstName?: string
  lastName?: string
  releaseDate?: Date
  dateOfBirth?: Date
  location?: string
  sentenceType?: SentenceType
  isInEducation?: boolean
  hasAdditionalNeeds?: boolean
  planStatus?: PlanActionStatus
  deadlineDate?: Date
}): PrisonerSearchSummary => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
  firstName: options?.firstName || 'IFEREECA',
  lastName: options?.lastName || 'PEIGH',
  dateOfBirth: options?.dateOfBirth,
  releaseDate: options?.releaseDate === null ? null : options?.releaseDate,
  sentenceType: options?.sentenceType || SentenceType.SENTENCED,
  location: options?.location || 'A-1-102',
  isInEducation: options?.isInEducation === false ? false : options?.isInEducation || true,
  hasAdditionalNeeds: options?.hasAdditionalNeeds === false ? false : options?.hasAdditionalNeeds || true,
  planStatus: options?.planStatus || PlanActionStatus.ACTIVE_PLAN,
  deadlineDate: options?.deadlineDate === null ? null : options?.deadlineDate,
})

export default aValidPrisonerSearchSummary
