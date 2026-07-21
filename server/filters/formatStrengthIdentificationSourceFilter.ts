import StrengthIdentificationSource from '../enums/strengthIdentificationSource'

const strengthCategoryScreenValues: Record<StrengthIdentificationSource, string> = {
  // Retained values (offered on the consolidated list) - RR-2788
  EDUCATION_SKILLS_WORK: 'Observed in education, skills and work',
  WIDER_PRISON: 'Observed in wider prison',
  SELF_DISCLOSURE: 'Self-disclosure by the individual',
  FORMAL_PROCESSES: 'Through formal processes such as referrals, assessments or screening tools',
  OTHER: 'Other',
  // Deprecated values - no longer offered on any form, retained so existing records still display - RR-2788
  CONVERSATIONS: 'Through conversations with the individual',
  COLLEAGUE_INFO: 'Based on information shared by colleagues or other professionals',
  OTHER_SCREENING_TOOL: 'Through other screening tools used within the prison',
}

const formatStrengthIdentificationSourceScreenValueFilter = (value: StrengthIdentificationSource): string =>
  strengthCategoryScreenValues[value]

export default formatStrengthIdentificationSourceScreenValueFilter
