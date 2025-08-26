import { startOfDay } from 'date-fns'
import type { CuriousAlnAndLddAssessmentsDto, CuriousAlnAssessmentDto, CuriousLddAssessmentDto } from 'dto'
import AlnAssessmentReferral from '../enums/alnAssessmentReferral'

const aCuriousAlnAndLddAssessmentsDto = (options?: {
  lddAssessments?: Array<CuriousLddAssessmentDto>
  alnAssessments?: Array<CuriousAlnAssessmentDto>
}): CuriousAlnAndLddAssessmentsDto => ({
  lddAssessments: options?.lddAssessments || [aCuriousLddAssessmentDto()],
  alnAssessments: options?.alnAssessments || [aCuriousAlnAssessmentDto()],
})

const aCuriousLddAssessmentDto = (options?: {
  prisonId?: string
  rapidAssessmentDate?: Date
  inDepthAssessmentDate?: Date
  primaryLddAndHealthNeed?: string
  additionalLddAndHealthNeeds?: Array<string>
}): CuriousLddAssessmentDto => ({
  prisonId: options?.prisonId || 'BXI',
  rapidAssessmentDate:
    options?.rapidAssessmentDate === null ? null : options?.rapidAssessmentDate || startOfDay('2024-10-20'),
  inDepthAssessmentDate:
    options?.inDepthAssessmentDate === null ? null : options?.inDepthAssessmentDate || startOfDay('2024-10-25'),
  primaryLddAndHealthNeed: options?.primaryLddAndHealthNeed || 'Visual impairment',
  additionalLddAndHealthNeeds: options?.additionalLddAndHealthNeeds || [
    'Hearing impairment',
    'Mental health difficulty',
    'Social and emotional difficulties',
  ],
})

const aCuriousAlnAssessmentDto = (options?: {
  prisonId?: string
  assessmentDate?: Date
  referral?: AlnAssessmentReferral
  supportPlanRequired?: boolean
  hasPrisonerConsent?: boolean
}): CuriousAlnAssessmentDto => ({
  prisonId: options?.prisonId || 'BXI',
  assessmentDate: options?.assessmentDate || startOfDay('2025-10-02'),
  referral: options?.referral || AlnAssessmentReferral.PSYCHOLOGY,
  supportPlanRequired: options?.supportPlanRequired === false ? false : options?.supportPlanRequired || true,
  hasPrisonerConsent: options?.hasPrisonerConsent === false ? false : options?.hasPrisonerConsent || true,
})

export { aCuriousAlnAndLddAssessmentsDto, aCuriousLddAssessmentDto, aCuriousAlnAssessmentDto }
