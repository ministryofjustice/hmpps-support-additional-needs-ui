import type { PlanReviewsResponse } from 'supportAdditionalNeedsApiClient'
import type { ReviewEducationSupportPlanDto } from 'dto'
import toReviewEducationSupportPlanDtos from './reviewEducationSupportPlanDtoMapper'
import {
  anEducationSupportPlanReviewResponse,
  aPlanReviewsResponse,
} from '../../testsupport/planReviewsResponseTestDataBuilder'
import aValidReviewEducationSupportPlanDto from '../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'

describe('educationSupportPlanDtoMapper', () => {
  const prisonNumber = 'A1234BC'

  describe('toReviewEducationSupportPlanDtos', () => {
    it('should map a PlanReviewsResponse to an array of ReviewEducationSupportPlanDto', () => {
      // Given
      const apiResponse = aPlanReviewsResponse({
        reviews: [
          anEducationSupportPlanReviewResponse({
            reviewCreatedBy: { name: 'Person 1', jobRole: 'Job Role 1' },
            otherContributors: [{ name: 'Person 2', jobRole: 'Job Role 2' }],
            prisonerDeclinedFeedback: false,
            prisonerFeedback: 'I feel that I am progressing well',
            reviewerFeedback: 'Chris is attending classes and progressing as expected',
          }),
        ],
      })

      const expected = [
        {
          ...aValidReviewEducationSupportPlanDto({
            prisonNumber: 'A1234BC',
            planReviewedByOther: { name: 'Person 1', jobRole: 'Job Role 1' },
            otherPeopleConsulted: [{ name: 'Person 2', jobRole: 'Job Role 2' }],
            prisonerDeclinedBeingPartOfReview: false,
            prisonerViewOnProgress: 'I feel that I am progressing well',
            reviewersViewOnProgress: 'Chris is attending classes and progressing as expected',
            prisonId: null,
            reviewDate: null,
            reviewExistingNeeds: null,
            additionalInformation: null,
          }),
          teachingAdjustmentsNeeded: null as boolean,
          teachingAdjustments: null as string,
          specificTeachingSkillsNeeded: null as boolean,
          specificTeachingSkills: null as string,
          examArrangementsNeeded: null as boolean,
          examArrangements: null as string,
          lnspSupportNeeded: null as boolean,
          lnspSupport: null as string,
          lnspSupportHours: null as number,
        },
      ]

      // When
      const actual = toReviewEducationSupportPlanDtos(prisonNumber, apiResponse)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map a null PlanReviewsResponse to an empty array of ReviewEducationSupportPlanDto', () => {
      // Given
      const apiResponse: PlanReviewsResponse = null

      const expected: Array<ReviewEducationSupportPlanDto> = []

      // When
      const actual = toReviewEducationSupportPlanDtos(prisonNumber, apiResponse)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
