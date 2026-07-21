import formatChallengeIdentificationSourceScreenValueFilter from './formatChallengeIdentificationSourceFilter'
import ChallengeIdentificationSource from '../enums/challengeIdentificationSource'

describe('formatChallengeIdentificationSourceFilter', () => {
  it.each([
    // Retained values - consolidated labels (RR-2788)
    { source: ChallengeIdentificationSource.EDUCATION_SKILLS_WORK, expected: 'Observed in education, skills and work' },
    { source: ChallengeIdentificationSource.WIDER_PRISON, expected: 'Observed in wider prison' },
    { source: ChallengeIdentificationSource.SELF_DISCLOSURE, expected: 'Self-disclosure by the individual' },
    {
      source: ChallengeIdentificationSource.FORMAL_PROCESSES,
      expected: 'Through formal processes such as referrals, assessments or screening tools',
    },
    { source: ChallengeIdentificationSource.OTHER, expected: 'Other' },
    // Deprecated values - original labels retained so existing records still display (RR-2788)
    { source: ChallengeIdentificationSource.CONVERSATIONS, expected: 'Through conversations with the individual' },
    {
      source: ChallengeIdentificationSource.COLLEAGUE_INFO,
      expected: 'Based on information shared by colleagues or other professionals',
    },
    {
      source: ChallengeIdentificationSource.OTHER_SCREENING_TOOL,
      expected: 'Through other screening tools used within the prison',
    },
  ])('should format $source as $expected', ({ source, expected }) => {
    expect(formatChallengeIdentificationSourceScreenValueFilter(source)).toEqual(expected)
  })
})
