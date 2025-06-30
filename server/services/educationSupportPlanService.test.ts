import { startOfToday, subDays } from 'date-fns'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import EducationSupportPlanService from './educationSupportPlanService'
import PlanCreationScheduleStatus from '../enums/planCreationScheduleStatus'
import aValidEducationSupportPlanDto from '../testsupport/educationSupportPlanDtoTestDataBuilder'
import aValidCreateEducationSupportPlanRequest from '../testsupport/createEducationSupportPlanRequestTestDataBuilder'
import aValidEducationSupportPlanResponse from '../testsupport/educationSupportPlanResponseTestDataBuilder'
import { aValidPlanCreationScheduleResponse } from '../testsupport/planCreationScheduleResponseTestDataBuilder'
import aValidPlanCreationScheduleDto from '../testsupport/planCreationScheduleDtoTestDataBuilder'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('educationSupportPlanService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const educationSupportPlanService = new EducationSupportPlanService(supportAdditionalNeedsApiClient)

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
      const actual = await educationSupportPlanService.createEducationSupportPlan(
        username,
        unPersistedEducationSupportPlanDto,
      )

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
      const actual = await educationSupportPlanService
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

  describe('getCurrentEducationSupportPlanCreationSchedule', () => {
    const expectedIncludeAllHistory = false

    it('should return the current education support plan creation schedule', async () => {
      // Given
      const firstSchedule = aValidPlanCreationScheduleResponse({
        version: 0,
        status: PlanCreationScheduleStatus.SCHEDULED,
      })
      const secondSchedule = aValidPlanCreationScheduleResponse({
        version: 1,
        status: PlanCreationScheduleStatus.EXEMPT_SYSTEM_TECHNICAL_ISSUE,
      })
      const thirdSchedule = aValidPlanCreationScheduleResponse({
        version: 2,
        status: PlanCreationScheduleStatus.SCHEDULED,
      })
      const scheduleDate = subDays(startOfToday(), 5)
      const currentSchedule = aValidPlanCreationScheduleResponse({
        version: 4,
        status: PlanCreationScheduleStatus.COMPLETED,
        deadlineDate: scheduleDate,
      })

      const apiResponse = {
        planCreationSchedules: [firstSchedule, secondSchedule, thirdSchedule, currentSchedule],
      }
      supportAdditionalNeedsApiClient.getEducationSupportPlanCreationSchedules.mockResolvedValue(apiResponse)

      const expected = aValidPlanCreationScheduleDto({
        prisonNumber,
        status: PlanCreationScheduleStatus.COMPLETED,
        deadlineDate: scheduleDate,
      })

      // When
      const actual = await educationSupportPlanService.getCurrentEducationSupportPlanCreationSchedule(
        prisonNumber,
        username,
      )

      // Then
      expect(actual).toEqual(expected)
      expect(supportAdditionalNeedsApiClient.getEducationSupportPlanCreationSchedules).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedIncludeAllHistory,
      )
    })

    it.each([
      null,
      { planCreationSchedules: null },
      { planCreationSchedules: undefined },
      { planCreationSchedules: [] },
    ])('should return null given API returns %s ', async apiResponse => {
      // Given
      supportAdditionalNeedsApiClient.getEducationSupportPlanCreationSchedules.mockResolvedValue(apiResponse)

      // When
      const actual = await educationSupportPlanService.getCurrentEducationSupportPlanCreationSchedule(
        prisonNumber,
        username,
      )

      // Then
      expect(actual).toBeNull()
      expect(supportAdditionalNeedsApiClient.getEducationSupportPlanCreationSchedules).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedIncludeAllHistory,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getEducationSupportPlanCreationSchedules.mockRejectedValue(expectedError)

      // When
      const actual = await educationSupportPlanService
        .getCurrentEducationSupportPlanCreationSchedule(prisonNumber, username)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getEducationSupportPlanCreationSchedules).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedIncludeAllHistory,
      )
    })
  })
})
