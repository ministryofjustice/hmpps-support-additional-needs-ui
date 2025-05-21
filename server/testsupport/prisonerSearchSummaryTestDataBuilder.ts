import type { PrisonerSearchSummary } from 'viewModels'
import SentenceType from '../enums/sentenceType'

const aValidPrisonerSearchSummary = (options?: {
  prisonNumber?: string
  prisonId?: string
  firstName?: string
  lastName?: string
  releaseDate?: Date
  dateOfBirth?: Date
  location?: string
  sentenceType?: SentenceType
  hasSupportPlan?: boolean
  hasSupportNeeds?: boolean
}): PrisonerSearchSummary => ({
  prisonNumber: options?.prisonNumber || 'A1234BC',
  prisonId: options?.prisonId || 'BXI',
  firstName: options?.firstName || 'IFEREECA',
  lastName: options?.lastName || 'PEIGH',
  dateOfBirth: options?.dateOfBirth,
  releaseDate: options?.releaseDate,
  sentenceType: options?.sentenceType || SentenceType.SENTENCED,
  location: options?.location || 'A-1-102',
  hasSupportPlan: options?.hasSupportPlan ?? false,
  hasSupportNeeds: options?.hasSupportNeeds ?? false,
})

export default aValidPrisonerSearchSummary
