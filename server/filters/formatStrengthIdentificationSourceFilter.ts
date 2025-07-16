import StrengthIdentificationSource from '../enums/strengthIdentificationSource'

const strengthCategoryScreenValues: Record<StrengthIdentificationSource, string> = {
  EDUCATION_SKILLS_WORK: 'Direct observation in education, skills and work',
  WIDER_PRISON: 'Direct observation in the wider prison',
  CONVERSATIONS: 'Through conversations with the individual',
  COLLEAGUE_INFO: 'Based on information shared by colleagues or other professionals',
  FORMAL_PROCESSES: 'Through formal processes (eg. referrals, assessments)',
  SELF_DISCLOSURE: 'Self-disclosure by the individual',
  OTHER_SCREENING_TOOL: 'Through other screening tools used within the prison',
  OTHER: 'Other',
}

const formatStrengthIdentificationSourceScreenValueFilter = (value: StrengthIdentificationSource): string =>
  strengthCategoryScreenValues[value]

export default formatStrengthIdentificationSourceScreenValueFilter
