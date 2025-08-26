import { startOfDay } from 'date-fns'
import type { CuriousAlnAndLddAssessmentsDto, CuriousAlnAssessmentDto, CuriousLddAssessmentDto } from 'dto'
import AlnAssessmentReferral from '../enums/alnAssessmentReferral'

const aCuriousAlnAndLddAssessmentsDto = (
  options: {
    lddAssessments?: Array<CuriousLddAssessmentDto>
    alnAssessments?: Array<CuriousAlnAssessmentDto>
  } = {
    lddAssessments: [aCuriousLddAssessmentDto()],
    alnAssessments: [aCuriousAlnAssessmentDto()],
  },
): CuriousAlnAndLddAssessmentsDto => ({
  lddAssessments: options.lddAssessments,
  alnAssessments: options.alnAssessments,
})

const aCuriousLddAssessmentDto = (
  options: {
    prisonId?: string
    rapidAssessmentDate?: Date
    inDepthAssessmentDate?: Date
    primaryLddAndHealthNeed?: string
    additionalLddAndHealthNeeds?: Array<string>
  } = {
    prisonId: 'BXI',
    rapidAssessmentDate: startOfDay('2024-10-20'),
    inDepthAssessmentDate: startOfDay('2024-10-25'),
    primaryLddAndHealthNeed: 'Visual impairment',
    additionalLddAndHealthNeeds: [
      'Hearing impairment',
      'Mental health difficulty',
      'Social and emotional difficulties',
    ],
  },
): CuriousLddAssessmentDto => ({
  prisonId: options.prisonId,
  rapidAssessmentDate: options.rapidAssessmentDate,
  inDepthAssessmentDate: options.inDepthAssessmentDate,
  primaryLddAndHealthNeed: options.primaryLddAndHealthNeed,
  additionalLddAndHealthNeeds: options.additionalLddAndHealthNeeds,
})

const aCuriousAlnAssessmentDto = (
  options: {
    prisonId?: string
    assessmentDate?: Date
    referral?: AlnAssessmentReferral
    supportPlanRequired?: boolean
    hasPrisonerConsent?: boolean
  } = {
    prisonId: 'BXI',
    assessmentDate: startOfDay('2025-10-02'),
    referral: AlnAssessmentReferral.PSYCHOLOGY,
    supportPlanRequired: true,
    hasPrisonerConsent: true,
  },
): CuriousAlnAssessmentDto => ({
  prisonId: options.prisonId,
  assessmentDate: options.assessmentDate,
  referral: options.referral,
  supportPlanRequired: options.supportPlanRequired,
  hasPrisonerConsent: options.hasPrisonerConsent,
})

export { aCuriousAlnAndLddAssessmentsDto, aCuriousLddAssessmentDto, aCuriousAlnAssessmentDto }
