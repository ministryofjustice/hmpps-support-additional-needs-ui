/**
 * An enum of Referral types for ALN Assessments
 * Different types of Assessment have different referral types.
 */
const enum AlnAssessmentReferral {
  HEALTHCARE = 'HEALTHCARE',
  PSYCHOLOGY = 'PSYCHOLOGY',
  EDUCATION = 'EDUCATION',
  SPECIALIST = 'SPECIALIST',
  NSM = 'NSM',
  SUBSTANCE_MISUSE_TEAM = 'SUBSTANCE_MISUSE_TEAM',
  SAFER_CUSTODY = 'SAFER_CUSTODY',
  OTHER = 'OTHER',
}

export default AlnAssessmentReferral
