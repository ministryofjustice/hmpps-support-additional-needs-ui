import formatStrengthIdentificationSourceScreenValueFilter from './formatStrengthIdentificationSourceFilter'
import StrengthIdentificationSource from '../enums/strengthIdentificationSource'

describe('formatStrengthIdentificationSourceFilter', () => {
  it.each([
    // Retained values - consolidated labels (RR-2788)
    { source: StrengthIdentificationSource.EDUCATION_SKILLS_WORK, expected: 'Observed in education, skills and work' },
    { source: StrengthIdentificationSource.WIDER_PRISON, expected: 'Observed in wider prison' },
    { source: StrengthIdentificationSource.SELF_DISCLOSURE, expected: 'Self-disclosure by the individual' },
    {
      source: StrengthIdentificationSource.FORMAL_PROCESSES,
      expected: 'Through formal processes such as referrals, assessments or screening tools',
    },
    { source: StrengthIdentificationSource.OTHER, expected: 'Other' },
    // Deprecated values - original labels retained so existing records still display (RR-2788)
    { source: StrengthIdentificationSource.CONVERSATIONS, expected: 'Through conversations with the individual' },
    {
      source: StrengthIdentificationSource.COLLEAGUE_INFO,
      expected: 'Based on information shared by colleagues or other professionals',
    },
    {
      source: StrengthIdentificationSource.OTHER_SCREENING_TOOL,
      expected: 'Through other screening tools used within the prison',
    },
  ])('should format $source as $expected', ({ source, expected }) => {
    expect(formatStrengthIdentificationSourceScreenValueFilter(source)).toEqual(expected)
  })
})
