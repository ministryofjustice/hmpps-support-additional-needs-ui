import type { Person } from 'supportAdditionalNeedsApiClient'
import SentenceType from '../enums/sentenceType'
import PlanActionStatus from '../enums/planActionStatus'

const aValidPerson = (options?: {
  forename?: string
  surname?: string
  prisonNumber?: string
  dateOfBirth?: string
  sentenceType?: SentenceType
  cellLocation?: string
  releaseDate?: string
  hasAdditionalNeed?: boolean
  inEducation?: boolean
  planStatus?: PlanActionStatus
  deadlineDate?: string
}): Person => ({
  forename: options?.forename || 'IFEREECA',
  surname: options?.surname || 'PEIGH',
  prisonNumber: options?.prisonNumber || 'A1234BC',
  dateOfBirth: options?.dateOfBirth || '1969-02-12',
  sentenceType: options?.sentenceType || SentenceType.SENTENCED,
  cellLocation: options?.cellLocation || 'A-1-102',
  releaseDate: options?.releaseDate === null ? null : options?.releaseDate || '2025-12-31',
  hasAdditionalNeed: options?.hasAdditionalNeed === false ? false : options?.hasAdditionalNeed || true,
  inEducation: options?.inEducation === false ? false : options?.inEducation || true,
  planStatus: options?.planStatus || PlanActionStatus.ACTIVE_PLAN,
  deadlineDate: options?.deadlineDate === null ? null : options?.deadlineDate || '2025-10-01',
})

export default aValidPerson
