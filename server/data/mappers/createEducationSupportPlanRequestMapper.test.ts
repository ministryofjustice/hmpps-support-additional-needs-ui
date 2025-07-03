import { addMonths, startOfToday } from 'date-fns'
import toCreateEducationSupportPlanRequest from './createEducationSupportPlanRequestMapper'
import aValidEducationSupportPlanDto from '../../testsupport/educationSupportPlanDtoTestDataBuilder'
import aValidCreateEducationSupportPlanRequest from '../../testsupport/createEducationSupportPlanRequestTestDataBuilder'

describe('createEducationSupportPlanRequestMapper', () => {
  describe('toCreateEducationSupportPlanRequest', () => {
    it('should map a fully populated EducationSupportPlanDto to a CreateEducationSupportPlanRequest', () => {
      // Given
      const dto = aValidEducationSupportPlanDto({
        prisonNumber: 'A1234BC',
        prisonId: 'BXI',
        planCreatedByOther: { name: 'Person 1', jobRole: 'Job Role 1' },
        otherPeopleConsulted: [{ name: 'Person 2', jobRole: 'Job Role 2' }],
        hasCurrentEhcp: true,
        learningEnvironmentAdjustments: 'Needs to sit at the front of the class',
        teachingAdjustments: 'Use simpler examples to help students understand concepts',
        specificTeachingSkills: 'Teacher with BSL proficiency required',
        examArrangements: 'Escort to the exam room 10 minutes before everyone else',
        lnspSupport: 'Chris will need text reading to him as he cannot read himself',
        individualSupport: 'Chris has asked that he is not sat with disruptive people as he is keen to learn',
        reviewDate: addMonths(startOfToday(), 2),
      })

      const expected = aValidCreateEducationSupportPlanRequest({
        prisonId: 'BXI',
        planCreatedBy: { name: 'Person 1', jobRole: 'Job Role 1' },
        otherContributors: [{ name: 'Person 2', jobRole: 'Job Role 2' }],
        hasCurrentEhcp: true,
        learningEnvironmentAdjustments: 'Needs to sit at the front of the class',
        teachingAdjustments: 'Use simpler examples to help students understand concepts',
        specificTeachingSkills: 'Teacher with BSL proficiency required',
        examAccessArrangements: 'Escort to the exam room 10 minutes before everyone else',
        lnspSupport: 'Chris will need text reading to him as he cannot read himself',
        individualSupport: 'Chris has asked that he is not sat with disruptive people as he is keen to learn',
        reviewDate: addMonths(startOfToday(), 2),
      })

      // When
      const actual = toCreateEducationSupportPlanRequest(dto)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map a minimally populated EducationSupportPlanDto to a CreateEducationSupportPlanRequest', () => {
      // Given
      const dto = aValidEducationSupportPlanDto({
        prisonNumber: 'A1234BC',
        prisonId: 'BXI',
        planCreatedByOther: null,
        otherPeopleConsulted: null,
        hasCurrentEhcp: false,
        learningEnvironmentAdjustments: null,
        teachingAdjustments: null,
        specificTeachingSkills: null,
        examArrangements: null,
        lnspSupport: null,
        reviewDate: addMonths(startOfToday(), 2),
        individualSupport: 'Chris has asked that he is not sat with disruptive people as he is keen to learn',
        additionalInformation: null,
      })

      const expected = aValidCreateEducationSupportPlanRequest({
        prisonId: 'BXI',
        planCreatedBy: null,
        otherContributors: null,
        hasCurrentEhcp: false,
        learningEnvironmentAdjustments: null,
        teachingAdjustments: null,
        specificTeachingSkills: null,
        examAccessArrangements: null,
        lnspSupport: null,
        reviewDate: addMonths(startOfToday(), 2),
        individualSupport: 'Chris has asked that he is not sat with disruptive people as he is keen to learn',
        detail: null,
      })

      // When
      const actual = toCreateEducationSupportPlanRequest(dto)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
