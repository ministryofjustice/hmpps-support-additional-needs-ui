import toEducationSupportPlanDto from './educationSupportPlanDtoMapper'
import aValidEducationSupportPlanResponse from '../../testsupport/educationSupportPlanResponseTestDataBuilder'
import aValidEducationSupportPlanDto from '../../testsupport/educationSupportPlanDtoTestDataBuilder'

describe('educationSupportPlanDtoMapper', () => {
  describe('toEducationSupportPlanDto', () => {
    it('should map a fully populated EducationSupportPlanResponse to a EducationSupportPlanDto', () => {
      // Given
      const prisonNumber = 'A1234BC'
      const apiResponse = aValidEducationSupportPlanResponse({
        planCreatedBy: { name: 'Person 1', jobRole: 'Job Role 1' },
        otherContributors: [{ name: 'Person 2', jobRole: 'Job Role 2' }],
        hasCurrentEhcp: true,
        learningEnvironmentAdjustments: 'Needs to sit at the front of the class',
        teachingAdjustments: 'Use simpler examples to help students understand concepts',
        specificTeachingSkills: 'Teacher with BSL proficiency required',
        examAccessArrangements: 'Escort to the exam room 10 minutes before everyone else',
        lnspSupport: 'Chris will need text reading to him as he cannot read himself',
      })

      const expected = aValidEducationSupportPlanDto({
        prisonNumber: 'A1234BC',
        planCreatedByOther: { name: 'Person 1', jobRole: 'Job Role 1' },
        otherPeopleConsulted: [{ name: 'Person 2', jobRole: 'Job Role 2' }],
        hasCurrentEhcp: true,
        learningEnvironmentAdjustments: 'Needs to sit at the front of the class',
        teachingAdjustments: 'Use simpler examples to help students understand concepts',
        specificTeachingSkills: 'Teacher with BSL proficiency required',
        examArrangements: 'Escort to the exam room 10 minutes before everyone else',
        lnspSupport: 'Chris will need text reading to him as he cannot read himself',
        prisonId: null,
        reviewDate: null,
      })

      // When
      const actual = toEducationSupportPlanDto(prisonNumber, apiResponse)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map a minimally populated EducationSupportPlanResponse to a EducationSupportPlanDto', () => {
      // Given
      const prisonNumber = 'A1234BC'
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
      })

      const expected = aValidEducationSupportPlanDto({
        prisonNumber: 'A1234BC',
        planCreatedByOther: null,
        otherPeopleConsulted: null,
        hasCurrentEhcp: false,
        learningEnvironmentAdjustments: null,
        teachingAdjustments: null,
        specificTeachingSkills: null,
        examArrangements: null,
        lnspSupport: null,
        additionalInformation: null,
        prisonId: null,
        reviewDate: null,
      })

      // When
      const actual = toEducationSupportPlanDto(prisonNumber, apiResponse)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
