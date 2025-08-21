import type {
  AllAssessmentDTO,
  LearnerLatestAssessmentV1DTO,
  LearnerAssessmentV1DTO,
  LearnerLddInfoExternalV1DTO,
  LearnerAssessmentV2DTO,
  ExternalAssessmentsDTO,
  LearnerAssessmentsDTO,
  LearnerAssessmentsFunctionalSkillsDTO,
  LearnerAssessmentsAlnDTO,
} from 'curiousApiClient'

const anAllAssessmentDTO = (
  options: {
    v1Assessments?: Array<LearnerLatestAssessmentV1DTO>
    v2Assessments?: LearnerAssessmentV2DTO
  } = {
    v1Assessments: [aLearnerLatestAssessmentV1DTO()],
    v2Assessments: aLearnerAssessmentV2DTO(),
  },
): AllAssessmentDTO => ({
  v1: options.v1Assessments,
  v2: options.v2Assessments,
})

const aLearnerLatestAssessmentV1DTO = (
  options: {
    prisonNumber?: string
    qualifications?: Array<LearnerAssessmentV1DTO>
    lddAssessments?: Array<LearnerLddInfoExternalV1DTO>
  } = {
    prisonNumber: 'A1234BC',
    qualifications: [aLearnerAssessmentV1DTO()],
    lddAssessments: [aLearnerLddInfoExternalV1DTO()],
  },
): LearnerLatestAssessmentV1DTO => ({
  prn: options.prisonNumber,
  qualifications: options.qualifications,
  ldd: options.lddAssessments,
})

const aLearnerAssessmentV1DTO = (
  options: {
    prisonId?: string
    prisonName?: string
    qualificationType?: 'English' | 'Maths' | 'Digital Literacy'
    qualificationGrade?: string
    assessmentDate?: string
  } = {
    prisonId: 'MDI',
    prisonName: 'MOORLAND (HMP & YOI)',
    qualificationType: 'English',
    qualificationGrade: 'Level 1',
    assessmentDate: '2012-02-16',
  },
): LearnerAssessmentV1DTO => ({
  establishmentId: options.prisonId,
  establishmentName: options.prisonName,
  qualification: {
    qualificationType: options.qualificationType,
    qualificationGrade: options.qualificationGrade,
    assessmentDate: options.assessmentDate,
  },
})

const aLearnerLddInfoExternalV1DTO = (
  options: {
    prisonId?: string
    prisonName?: string
    lddPrimaryName?: string
    lddSecondaryNames?: string[]
    inDepthAssessmentDate?: string
    rapidAssessmentDate?: string
  } = {
    prisonId: 'MDI',
    prisonName: 'MOORLAND (HMP & YOI)',
    lddPrimaryName: 'Visual impairment',
    lddSecondaryNames: ['Hearing impairment', 'Mental health difficulty', 'Social and emotional difficulties'],
    inDepthAssessmentDate: '2012-02-16',
    rapidAssessmentDate: '2012-02-16',
  },
): LearnerLddInfoExternalV1DTO => ({
  establishmentId: options.prisonId,
  establishmentName: options.prisonName,
  lddPrimaryName: options.lddPrimaryName,
  lddSecondaryNames: options.lddSecondaryNames,
  inDepthAssessmentDate: options.inDepthAssessmentDate,
  rapidAssessmentDate: options.rapidAssessmentDate,
})

const aLearnerAssessmentV2DTO = (
  options: {
    prisonNumber?: string
    assessments?: ExternalAssessmentsDTO
  } = {
    prisonNumber: 'A1234BC',
    assessments: anExternalAssessmentsDTO(),
  },
): LearnerAssessmentV2DTO => ({
  prn: options.prisonNumber,
  assessments: options.assessments,
})

const anExternalAssessmentsDTO = (
  options: {
    alnAssessments?: Array<LearnerAssessmentsAlnDTO>
    digitalFunctionalSkillsAssessments?: Array<LearnerAssessmentsFunctionalSkillsDTO>
    englishFunctionalSkills?: Array<LearnerAssessmentsFunctionalSkillsDTO>
    mathsFunctionalSkills?: Array<LearnerAssessmentsFunctionalSkillsDTO>
    esolAssessments?: Array<LearnerAssessmentsDTO>
    readingAssessments?: Array<LearnerAssessmentsDTO>
  } = {
    alnAssessments: [anAlnLearnerAssessmentsDTO()],
    digitalFunctionalSkillsAssessments: [aDigitalFunctionalSkillsLearnerAssessmentsDTO()],
    englishFunctionalSkills: [anEnglishFunctionalSkillsLearnerAssessmentsDTO()],
    mathsFunctionalSkills: [aMathsFunctionalSkillsLearnerAssessmentsDTO()],
    esolAssessments: [anEsolLearnerAssessmentsDTO()],
    readingAssessments: [aReadingLearnerAssessmentsDTO()],
  },
): ExternalAssessmentsDTO => ({
  aln: options.alnAssessments,
  digitalSkillsFunctionalSkills: options.digitalFunctionalSkillsAssessments,
  englishFunctionalSkills: options.englishFunctionalSkills,
  mathsFunctionalSkills: options.mathsFunctionalSkills,
  esol: options.esolAssessments,
  reading: options.readingAssessments,
})

const anAlnLearnerAssessmentsDTO = (
  options: {
    prisonId?: string
    prisonName?: string
    assessmentDate?: string
    assessmentOutcome?: 'Yes' | 'No'
    hasPrisonerConsent?: 'Yes' | 'No'
    stakeholderReferral?:
      | 'Healthcare'
      | 'Psychology'
      | 'Education'
      | 'Specialist'
      | 'NSM'
      | 'Substance Misuse Team'
      | 'Safer Custody'
      | 'Other'
  } = {
    prisonId: 'MDI',
    prisonName: 'MOORLAND (HMP & YOI)',
    assessmentDate: '2025-10-01',
    assessmentOutcome: 'Yes',
    hasPrisonerConsent: 'Yes',
    stakeholderReferral: 'Education',
  },
): LearnerAssessmentsAlnDTO => ({
  establishmentId: options.prisonId,
  establishmentName: options.prisonName,
  assessmentDate: options.assessmentDate,
  assessmentOutcome: options.assessmentOutcome,
  hasPrisonerConsent: options.hasPrisonerConsent,
  stakeholderReferral: options.stakeholderReferral,
})

const aReadingLearnerAssessmentsDTO = (
  options: {
    prisonId?: string
    prisonName?: string
    assessmentDate?: string
    assessmentNextStep?: 'Refer for reading support level.' | 'Reading support not required at this time.'
    assessmentOutcome?: 'non-reader' | 'new reader' | 'emerging reader' | 'consolidating reader' | 'established reader'
    stakeholderReferral?:
      | 'Healthcare'
      | 'Psychology'
      | 'Education'
      | 'Specialist'
      | 'NSM'
      | 'Substance Misuse Team'
      | 'Other'
    hasPrisonerConsent?: 'Yes' | 'No'
  } = {
    prisonId: 'MDI',
    prisonName: 'MOORLAND (HMP & YOI)',
    assessmentDate: '2025-10-01',
    assessmentNextStep: 'Refer for reading support level.',
    assessmentOutcome: 'non-reader',
    hasPrisonerConsent: 'Yes',
    stakeholderReferral: 'Education',
  },
): LearnerAssessmentsDTO => ({
  establishmentId: options.prisonId,
  establishmentName: options.prisonName,
  assessmentDate: options.assessmentDate,
  assessmentNextStep: options.assessmentNextStep,
  assessmentOutcome: options.assessmentOutcome,
  hasPrisonerConsent: options.hasPrisonerConsent,
  stakeholderReferral: options.stakeholderReferral,
})

const anEsolLearnerAssessmentsDTO = (
  options: {
    prisonId?: string
    prisonName?: string
    assessmentDate?: string
    assessmentNextStep?:
      | 'English Language Support Level 1'
      | 'English Language Support Level 2'
      | 'English Language Support Level 3'
    assessmentOutcome?: 'ESOL Pathway' | 'Function Skills Pathway'
    stakeholderReferral?:
      | 'Healthcare'
      | 'Psychology'
      | 'Education'
      | 'Specialist'
      | 'NSM'
      | 'Substance Misuse Team'
      | 'Other'
    hasPrisonerConsent?: 'Yes' | 'No'
  } = {
    prisonId: 'MDI',
    prisonName: 'MOORLAND (HMP & YOI)',
    assessmentDate: '2025-10-01',
    assessmentNextStep: 'English Language Support Level 1',
    assessmentOutcome: 'ESOL Pathway',
    hasPrisonerConsent: 'Yes',
    stakeholderReferral: 'Education',
  },
): LearnerAssessmentsDTO => ({
  establishmentId: options.prisonId,
  establishmentName: options.prisonName,
  assessmentDate: options.assessmentDate,
  assessmentNextStep: options.assessmentNextStep,
  assessmentOutcome: options.assessmentOutcome,
  hasPrisonerConsent: options.hasPrisonerConsent,
  stakeholderReferral: options.stakeholderReferral,
})

const anEnglishFunctionalSkillsLearnerAssessmentsDTO = (
  options: {
    prisonId?: string
    prisonName?: string
    assessmentDate?: string
    assessmentNextStep?:
      | 'Progress to course at level consistent with assessment result'
      | 'Progress to course at lower level due to individual circumstances'
      | 'Progress to higher level based on evidence of prior attainment'
    workingTowardsLevel?:
      | 'Pre-Entry'
      | 'Entry Level 1'
      | 'Entry Level 2'
      | 'Entry Level 3'
      | 'Level 1'
      | 'Level 2'
      | 'Level 3'
    levelBranding?:
      | '0.0'
      | '0.1'
      | '0.2'
      | '0.3'
      | '0.4'
      | '0.5'
      | '0.6'
      | '0.7'
      | '0.8'
      | '0.9'
      | '1.0'
      | '1.1'
      | '1.2'
      | '1.3'
      | '1.4'
      | '1.5'
      | '1.6'
      | '1.7'
      | '1.8'
      | '1.9'
      | '2.0'
      | '2.1'
      | '2.2'
      | '2.3'
      | '2.4'
      | '2.5'
      | '2.6'
      | '2.7'
      | '2.8'
      | '2.9'
      | '3.0'
      | '3.1'
      | '3.2'
      | '3.3'
      | '3.4'
      | '3.5'
      | '3.6'
      | '3.7'
      | '3.8'
      | '3.9'
    stakeholderReferral?:
      | 'Healthcare'
      | 'Psychology'
      | 'Education'
      | 'Specialist'
      | 'NSM'
      | 'Substance Misuse Team'
      | 'Other'
    hasPrisonerConsent?: 'Yes' | 'No'
  } = {
    prisonId: 'MDI',
    prisonName: 'MOORLAND (HMP & YOI)',
    assessmentDate: '2025-10-01',
    assessmentNextStep: 'Progress to course at level consistent with assessment result',
    workingTowardsLevel: 'Entry Level 2',
    levelBranding: '2.1',
    hasPrisonerConsent: 'Yes',
    stakeholderReferral: 'Education',
  },
): LearnerAssessmentsFunctionalSkillsDTO => ({
  establishmentId: options.prisonId,
  establishmentName: options.prisonName,
  assessmentDate: options.assessmentDate,
  assessmentNextStep: options.assessmentNextStep,
  workingTowardsLevel: options.workingTowardsLevel,
  levelBranding: options.levelBranding,
  hasPrisonerConsent: options.hasPrisonerConsent,
  stakeholderReferral: options.stakeholderReferral,
})

const aMathsFunctionalSkillsLearnerAssessmentsDTO = (
  options: {
    prisonId?: string
    prisonName?: string
    assessmentDate?: string
    assessmentNextStep?:
      | 'Progress to course at level consistent with assessment result'
      | 'Progress to course at lower level due to individual circumstances'
      | 'Progress to higher level based on evidence of prior attainment'
    workingTowardsLevel?:
      | 'Pre-Entry'
      | 'Entry Level 1'
      | 'Entry Level 2'
      | 'Entry Level 3'
      | 'Level 1'
      | 'Level 2'
      | 'Level 3'
    levelBranding?:
      | '0.0'
      | '0.1'
      | '0.2'
      | '0.3'
      | '0.4'
      | '0.5'
      | '0.6'
      | '0.7'
      | '0.8'
      | '0.9'
      | '1.0'
      | '1.1'
      | '1.2'
      | '1.3'
      | '1.4'
      | '1.5'
      | '1.6'
      | '1.7'
      | '1.8'
      | '1.9'
      | '2.0'
      | '2.1'
      | '2.2'
      | '2.3'
      | '2.4'
      | '2.5'
      | '2.6'
      | '2.7'
      | '2.8'
      | '2.9'
      | '3.0'
      | '3.1'
      | '3.2'
      | '3.3'
      | '3.4'
      | '3.5'
      | '3.6'
      | '3.7'
      | '3.8'
      | '3.9'
    stakeholderReferral?:
      | 'Healthcare'
      | 'Psychology'
      | 'Education'
      | 'Specialist'
      | 'NSM'
      | 'Substance Misuse Team'
      | 'Other'
    hasPrisonerConsent?: 'Yes' | 'No'
  } = {
    prisonId: 'MDI',
    prisonName: 'MOORLAND (HMP & YOI)',
    assessmentDate: '2025-10-01',
    assessmentNextStep: 'Progress to course at level consistent with assessment result',
    workingTowardsLevel: 'Entry Level 2',
    levelBranding: '2.1',
    hasPrisonerConsent: 'Yes',
    stakeholderReferral: 'Education',
  },
): LearnerAssessmentsFunctionalSkillsDTO => ({
  establishmentId: options.prisonId,
  establishmentName: options.prisonName,
  assessmentDate: options.assessmentDate,
  assessmentNextStep: options.assessmentNextStep,
  workingTowardsLevel: options.workingTowardsLevel,
  levelBranding: options.levelBranding,
  hasPrisonerConsent: options.hasPrisonerConsent,
  stakeholderReferral: options.stakeholderReferral,
})

const aDigitalFunctionalSkillsLearnerAssessmentsDTO = (
  options: {
    prisonId?: string
    prisonName?: string
    assessmentDate?: string
    workingTowardsLevel?: 'Pre-Entry' | 'Entry Level' | 'Level 1'
    levelBranding?:
      | '0.0'
      | '0.1'
      | '0.2'
      | '0.3'
      | '0.4'
      | '0.5'
      | '0.6'
      | '0.7'
      | '0.8'
      | '0.9'
      | '1.0'
      | '1.1'
      | '1.2'
      | '1.3'
      | '1.4'
      | '1.5'
      | '1.6'
      | '1.7'
      | '1.8'
      | '1.9'
  } = {
    prisonId: 'MDI',
    prisonName: 'MOORLAND (HMP & YOI)',
    assessmentDate: '2025-10-01',
    workingTowardsLevel: 'Level 1',
    levelBranding: '1.2',
  },
): LearnerAssessmentsFunctionalSkillsDTO => ({
  establishmentId: options.prisonId,
  establishmentName: options.prisonName,
  assessmentDate: options.assessmentDate,
  workingTowardsLevel: options.workingTowardsLevel,
  levelBranding: options.levelBranding,
  assessmentNextStep: null,
  hasPrisonerConsent: null,
  stakeholderReferral: null,
})

export {
  anAllAssessmentDTO,
  aLearnerLatestAssessmentV1DTO,
  aLearnerAssessmentV1DTO,
  aLearnerLddInfoExternalV1DTO,
  aLearnerAssessmentV2DTO,
  anExternalAssessmentsDTO,
  anAlnLearnerAssessmentsDTO,
  aReadingLearnerAssessmentsDTO,
  anEsolLearnerAssessmentsDTO,
  anEnglishFunctionalSkillsLearnerAssessmentsDTO,
  aMathsFunctionalSkillsLearnerAssessmentsDTO,
  aDigitalFunctionalSkillsLearnerAssessmentsDTO,
}
