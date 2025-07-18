import { startOfToday, subDays } from 'date-fns'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import EducationSupportPlanScheduleService from './educationSupportPlanScheduleService'
import PlanCreationScheduleStatus from '../enums/planCreationScheduleStatus'
import { aValidPlanCreationScheduleResponse } from '../testsupport/planCreationScheduleResponseTestDataBuilder'
import aValidPlanCreationScheduleDto from '../testsupport/planCreationScheduleDtoTestDataBuilder'
import PlanCreationScheduleExemptionReason from '../enums/planCreationScheduleExemptionReason'
import aValidUpdatePlanCreationStatusRequest from '../testsupport/updatePlanCreationStatusRequestTestDataBuilder'
import aValidRefuseEducationSupportPlanDto from '../testsupport/refuseEducationSupportPlanDtoTestDataBuilder'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('educationSupportPlanScheduleService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const service = new EducationSupportPlanScheduleService(supportAdditionalNeedsApiClient)

  const prisonNumber = 'A1234BC'
  const prisonId = 'MDI'
  const username = 'some-username'

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('getCurrentEducationSupportPlanCreationSchedule', () => {
    const expectedIncludeAllHistory = false

    it('should return the current education support plan creation schedule', async () => {
      // Given
      const scheduleDate = subDays(startOfToday(), 5)
      const currentSchedule = aValidPlanCreationScheduleResponse({
        version: 4,
        status: PlanCreationScheduleStatus.COMPLETED,
        deadlineDate: scheduleDate,
      })

      const apiResponse = {
        planCreationSchedules: [currentSchedule],
      }
      supportAdditionalNeedsApiClient.getEducationSupportPlanCreationSchedules.mockResolvedValue(apiResponse)

      const expected = aValidPlanCreationScheduleDto({
        prisonNumber,
        status: PlanCreationScheduleStatus.COMPLETED,
        deadlineDate: scheduleDate,
      })

      // When
      const actual = await service.getCurrentEducationSupportPlanCreationSchedule(prisonNumber, username)

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
      const actual = await service.getCurrentEducationSupportPlanCreationSchedule(prisonNumber, username)

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
      const actual = await service.getCurrentEducationSupportPlanCreationSchedule(prisonNumber, username).catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getEducationSupportPlanCreationSchedules).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedIncludeAllHistory,
      )
    })
  })

  describe('updateEducationSupportPlanCreationScheduleAsRefused', () => {
    it('should update education support plan creation schedule as refused', async () => {
      // Given
      const scheduleDate = subDays(startOfToday(), 5)
      const currentSchedule = aValidPlanCreationScheduleResponse({
        version: 4,
        status: PlanCreationScheduleStatus.COMPLETED,
        deadlineDate: scheduleDate,
      })

      const apiResponse = {
        planCreationSchedules: [currentSchedule],
      }
      supportAdditionalNeedsApiClient.updateEducationSupportPlanCreationScheduleStatus.mockResolvedValue(apiResponse)

      const expectedUpdateStatusRequest = aValidUpdatePlanCreationStatusRequest({
        prisonId,
        status: PlanCreationScheduleStatus.EXEMPT_PRISONER_NOT_COMPLY,
        exemptionReason: PlanCreationScheduleExemptionReason.EXEMPT_REFUSED_TO_ENGAGE,
        exemptionDetail: 'Chris does not feel he needs a plan',
      })

      const expected = aValidPlanCreationScheduleDto({
        prisonNumber,
        status: PlanCreationScheduleStatus.COMPLETED,
        deadlineDate: scheduleDate,
      })

      const refuseEducationSupportPlanDto = aValidRefuseEducationSupportPlanDto({
        prisonNumber,
        prisonId,
        reason: PlanCreationScheduleExemptionReason.EXEMPT_REFUSED_TO_ENGAGE,
        details: 'Chris does not feel he needs a plan',
      })

      // When
      const actual = await service.updateEducationSupportPlanCreationScheduleAsRefused(
        username,
        refuseEducationSupportPlanDto,
      )

      // Then
      expect(actual).toEqual(expected)
      expect(supportAdditionalNeedsApiClient.updateEducationSupportPlanCreationScheduleStatus).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedUpdateStatusRequest,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.updateEducationSupportPlanCreationScheduleStatus.mockRejectedValue(expectedError)

      const expectedUpdateStatusRequest = aValidUpdatePlanCreationStatusRequest({
        prisonId,
        status: PlanCreationScheduleStatus.EXEMPT_PRISONER_NOT_COMPLY,
        exemptionReason: PlanCreationScheduleExemptionReason.EXEMPT_REFUSED_TO_ENGAGE,
        exemptionDetail: 'Chris does not feel he needs a plan',
      })

      const refuseEducationSupportPlanDto = aValidRefuseEducationSupportPlanDto({
        prisonNumber,
        prisonId,
        reason: PlanCreationScheduleExemptionReason.EXEMPT_REFUSED_TO_ENGAGE,
        details: 'Chris does not feel he needs a plan',
      })

      // When
      const actual = await service
        .updateEducationSupportPlanCreationScheduleAsRefused(username, refuseEducationSupportPlanDto)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.updateEducationSupportPlanCreationScheduleStatus).toHaveBeenCalledWith(
        prisonNumber,
        username,
        expectedUpdateStatusRequest,
      )
    })
  })
})
