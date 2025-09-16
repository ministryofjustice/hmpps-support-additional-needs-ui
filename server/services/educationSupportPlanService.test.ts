import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import EducationSupportPlanService from './educationSupportPlanService'
import aValidEducationSupportPlanDto from '../testsupport/educationSupportPlanDtoTestDataBuilder'
import aValidCreateEducationSupportPlanRequest from '../testsupport/createEducationSupportPlanRequestTestDataBuilder'
import aValidEducationSupportPlanResponse from '../testsupport/educationSupportPlanResponseTestDataBuilder'
import aPlanActionStatus from '../testsupport/planActionStatusTestDataBuilder'
import aPlanLifecycleStatusDto from '../testsupport/planLifecycleStatusDtoTestDataBuilder'

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
    it('should create education support plan', async () => {
      // Given
      const unPersistedEducationSupportPlanDto = aValidEducationSupportPlanDto({
        prisonNumber,
        prisonId,
        reviewBeforeCreatingPlan: true,
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
        reviewBeforeCreatingPlan: null,
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

  describe('getEducationSupportPlan', () => {
    it('should get education support plan', async () => {
      // Given
      const educationSupportPlanListResponse = aValidEducationSupportPlanResponse()
      supportAdditionalNeedsApiClient.getEducationSupportPlan.mockResolvedValue(educationSupportPlanListResponse)

      const expectedEducationSupportPlan = aValidEducationSupportPlanDto({
        prisonId: null,
        reviewDate: null,
        reviewBeforeCreatingPlan: null,
        planCreatedByOther: { name: 'Alan Teacher', jobRole: 'Education Instructor' },
      })

      // When
      const actual = await service.getEducationSupportPlan(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedEducationSupportPlan)
      expect(supportAdditionalNeedsApiClient.getEducationSupportPlan).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should return null given API returns null', async () => {
      // Given
      supportAdditionalNeedsApiClient.getEducationSupportPlan.mockResolvedValue(null)

      // When
      const actual = await service.getEducationSupportPlan(username, prisonNumber)

      // Then
      expect(actual).toBeNull()
      expect(supportAdditionalNeedsApiClient.getEducationSupportPlan).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getEducationSupportPlan.mockRejectedValue(expectedError)

      // When
      const actual = await service.getEducationSupportPlan(username, prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getEducationSupportPlan).toHaveBeenCalledWith(prisonNumber, username)
    })
  })

  describe('getEducationSupportPlanLifecycleStatus', () => {
    it('should get education support plan lifecycle status', async () => {
      // Given
      const apiResponse = aPlanActionStatus()
      supportAdditionalNeedsApiClient.getPlanActionStatus.mockResolvedValue(apiResponse)

      const expectedPlanLifecycleStatusDto = aPlanLifecycleStatusDto()

      // When
      const actual = await service.getEducationSupportPlanLifecycleStatus(username, prisonNumber)

      // Then
      expect(actual).toEqual(expectedPlanLifecycleStatusDto)
      expect(supportAdditionalNeedsApiClient.getPlanActionStatus).toHaveBeenCalledWith(prisonNumber, username)
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getPlanActionStatus.mockRejectedValue(expectedError)

      // When
      const actual = await service.getEducationSupportPlanLifecycleStatus(username, prisonNumber).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getPlanActionStatus).toHaveBeenCalledWith(prisonNumber, username)
    })
  })
})
