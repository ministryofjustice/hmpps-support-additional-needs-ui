import { parseISO } from 'date-fns'
import type {
  AllAssessmentDTO,
  LearnerAssessmentsAlnDTO,
  LearnerLatestAssessmentV1DTO,
  LearnerLddInfoExternalV1DTO,
} from 'curiousApiClient'
import type { CuriousAlnAndLddAssessmentsDto, CuriousAlnAssessmentDto, CuriousLddAssessmentDto } from 'dto'
import AlnAssessmentReferral from '../../enums/alnAssessmentReferral'

const toCuriousAlnAndLddAssessmentsDto = (apiResponse: AllAssessmentDTO): CuriousAlnAndLddAssessmentsDto => ({
  lddAssessments: apiResponse?.v1?.flatMap(toCuriousLddAssessmentDtos) || [],
  alnAssessments: apiResponse?.v2?.assessments?.aln?.map(toCuriousAlnAssessmentDto) || [],
})

const toCuriousLddAssessmentDtos = (apiResponse: LearnerLatestAssessmentV1DTO): Array<CuriousLddAssessmentDto> => {
  const curiousV1LddAssessments: Array<LearnerLddInfoExternalV1DTO> = apiResponse.ldd
  return curiousV1LddAssessments
    .filter(
      (lddAssessment: LearnerLddInfoExternalV1DTO) =>
        // At least one of the 4 fields needs to have a value for it to be considered a valid LDD record and for us to map it
        lddAssessment.lddPrimaryName?.length > 0 ||
        (lddAssessment.lddSecondaryNames || []).length > 0 ||
        lddAssessment.rapidAssessmentDate != null ||
        lddAssessment.inDepthAssessmentDate != null,
    )
    .map(lddAssessment => ({
      prisonId: lddAssessment.establishmentId,
      rapidAssessmentDate: lddAssessment.rapidAssessmentDate ? parseISO(lddAssessment.rapidAssessmentDate) : null,
      inDepthAssessmentDate: lddAssessment.inDepthAssessmentDate ? parseISO(lddAssessment.inDepthAssessmentDate) : null,
      primaryLddAndHealthNeed: lddAssessment.lddPrimaryName,
      additionalLddAndHealthNeeds: lddAssessment.lddSecondaryNames || [],
    }))
}

const toCuriousAlnAssessmentDto = (curiousV2AlnAssessment: LearnerAssessmentsAlnDTO): CuriousAlnAssessmentDto => ({
  prisonId: curiousV2AlnAssessment.establishmentId,
  assessmentDate: parseISO(curiousV2AlnAssessment.assessmentDate),
  referral: curiousV2AlnAssessment.stakeholderReferral
    ? curiousV2AlnAssessment.stakeholderReferral.split(',').map(toAlnAssessmentReferral)
    : [],
  supportPlanRequired: curiousV2AlnAssessment.assessmentOutcome?.toLowerCase().trim() === 'yes',
})

const toAlnAssessmentReferral = (apiStakeholderReferral: string): AlnAssessmentReferral =>
  ({
    healthcare: AlnAssessmentReferral.HEALTHCARE,
    psychology: AlnAssessmentReferral.PSYCHOLOGY,
    'education specialist': AlnAssessmentReferral.EDUCATION_SPECIALIST,
    nsm: AlnAssessmentReferral.NSM,
    'substance misuse team': AlnAssessmentReferral.SUBSTANCE_MISUSE_TEAM,
    'safer custody': AlnAssessmentReferral.SAFER_CUSTODY,
    other: AlnAssessmentReferral.OTHER,
  })[apiStakeholderReferral?.toLowerCase().trim()]

export default toCuriousAlnAndLddAssessmentsDto
