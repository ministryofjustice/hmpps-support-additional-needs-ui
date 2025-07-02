import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import EducationSupportPlanService from './educationSupportPlanService'
import aValidEducationSupportPlanDto from '../testsupport/educationSupportPlanDtoTestDataBuilder'
import aValidCreateEducationSupportPlanRequest from '../testsupport/createEducationSupportPlanRequestTestDataBuilder'
import aValidEducationSupportPlanResponse from '../testsupport/educationSupportPlanResponseTestDataBuilder'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('educationSupportPlanService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const service = new EducationSupportPlanService(supportAdditionalNeedsApiClient)

  const prisonNumber = 'A1234BC'
  const prisonId = 'MDI'
  const username = 'some-username'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('createEducationSupportPlan', () => {
    it('should created education support plan', async () => {
      // Given
      const unPersistedEducationSupportPlanDto = aValidEducationSupportPlanDto({
        prisonNumber,
        prisonId,
        planCreatedByOther: null,
        otherPeopleConsulted: null,
      })
      const expectedCreateEducationSupportPlanRequest = aValidCreateEducationSupportPlanRequest({
        prisonId,
        planCreatedBy: null,
        otherContributors: null,
      })

      const createdEducationSupportPlanResponse = aValidEducationSupportPlanResponse({
        planCreatedBy: null,
        otherContributors: null,
      })
      supportAdditionalNeedsApiClient.createEducationSupportPlan.mockResolvedValue(createdEducationSupportPlanResponse)

      const expectedCreatedEducationSupportPlanDto = aValidEducationSupportPlanDto({
        prisonNumber,
        planCreatedByOther: null,
        otherPeopleConsulted: null,
        reviewDate: null,
        prisonId: null,
      })

      // When
      const actual = await service.createEducationSupportPlan(username, unPersistedEducationSupportPlanDto)

      // Then
      expect(actual).toEqual(expectedCreatedEducationSupportPlanDto)
      expect(supportAdditionalNeedsApiClient.createEducationSupportPlan).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedCreateEducationSupportPlanRequest,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.createEducationSupportPlan.mockRejectedValue(expectedError)

      const unPersistedEducationSupportPlanDto = aValidEducationSupportPlanDto({
        prisonNumber,
        prisonId,
        planCreatedByOther: null,
        otherPeopleConsulted: null,
      })
      const expectedCreateEducationSupportPlanRequest = aValidCreateEducationSupportPlanRequest({
        prisonId,
        planCreatedBy: null,
        otherContributors: null,
      })

      // When
      const actual = await service
        .createEducationSupportPlan(username, unPersistedEducationSupportPlanDto)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.createEducationSupportPlan).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedCreateEducationSupportPlanRequest,
      )
    })
  })
})
