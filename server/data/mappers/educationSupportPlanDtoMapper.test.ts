import type { EducationSupportPlanResponse } from 'supportAdditionalNeedsApiClient'
import toEducationSupportPlanDto from './educationSupportPlanDtoMapper'
import aValidEducationSupportPlanResponse from '../../testsupport/educationSupportPlanResponseTestDataBuilder'
import aValidEducationSupportPlanDto from '../../testsupport/educationSupportPlanDtoTestDataBuilder'

describe('educationSupportPlanDtoMapper', () => {
  const prisonNumber = 'A1234BC'

  describe('toEducationSupportPlanDto', () => {
    it('should map a fully populated EducationSupportPlanResponse to a EducationSupportPlanDto', () => {
      // Given
      const apiResponse = aValidEducationSupportPlanResponse({
        planCreatedBy: { name: 'Person 1', jobRole: 'Job Role 1' },
        otherContributors: [{ name: 'Person 2', jobRole: 'Job Role 2' }],
        hasCurrentEhcp: true,
        learningEnvironmentAdjustments: 'Needs to sit at the front of the class',
        teachingAdjustments: 'Use simpler examples to help students understand concepts',
        specificTeachingSkills: 'Teacher with BSL proficiency required',
        examAccessArrangements: 'Escort to the exam room 10 minutes before everyone else',
        lnspSupport: 'Chris will need text reading to him as he cannot read himself',
        lnspSupportHours: 20,
        individualSupport: 'Chris has asked that he is not sat with disruptive people as he is keen to learn',
        detail: 'Chris is happy with his plan',
      })

      const expected = aValidEducationSupportPlanDto({
        prisonNumber: 'A1234BC',
        planCreatedByOther: { name: 'Person 1', jobRole: 'Job Role 1' },
        otherPeopleConsulted: [{ name: 'Person 2', jobRole: 'Job Role 2' }],
        hasCurrentEhcp: true,
        teachingAdjustments: 'Use simpler examples to help students understand concepts',
        specificTeachingSkills: 'Teacher with BSL proficiency required',
        examArrangements: 'Escort to the exam room 10 minutes before everyone else',
        lnspSupport: 'Chris will need text reading to him as he cannot read himself',
        lnspSupportHours: 20,
        individualSupport: 'Chris has asked that he is not sat with disruptive people as he is keen to learn',
        additionalInformation: 'Chris is happy with his plan',
        prisonId: null,
        reviewDate: null,
        reviewBeforeCreatingPlan: null,
        planReviewedByOther: null,
      })

      // When
      const actual = toEducationSupportPlanDto(prisonNumber, apiResponse)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map a minimally populated EducationSupportPlanResponse to a EducationSupportPlanDto', () => {
      // Given
      const apiResponse = aValidEducationSupportPlanResponse({
        planCreatedBy: null,
        otherContributors: null,
        hasCurrentEhcp: false,
        learningEnvironmentAdjustments: null,
        teachingAdjustments: null,
        specificTeachingSkills: null,
        examAccessArrangements: null,
        lnspSupport: null,
        detail: null,
        individualSupport: 'Chris has asked that he is not sat with disruptive people as he is keen to learn', // This is not a nullable/optional field
      })

      const expected = aValidEducationSupportPlanDto({
        prisonNumber: 'A1234BC',
        planCreatedByOther: null,
        otherPeopleConsulted: null,
        hasCurrentEhcp: false,
        teachingAdjustments: null,
        specificTeachingSkills: null,
        examArrangements: null,
        lnspSupport: null,
        additionalInformation: null,
        individualSupport: 'Chris has asked that he is not sat with disruptive people as he is keen to learn',
        prisonId: null,
        reviewDate: null,
        reviewBeforeCreatingPlan: null,
        planReviewedByOther: null,
      })

      // When
      const actual = toEducationSupportPlanDto(prisonNumber, apiResponse)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should not map a null EducationSupportPlanResponse to a EducationSupportPlanDto', () => {
      // Given
      const apiResponse: EducationSupportPlanResponse = null

      // When
      const actual = toEducationSupportPlanDto(prisonNumber, apiResponse)

      // Then
      expect(actual).toBeNull()
    })
  })
})
