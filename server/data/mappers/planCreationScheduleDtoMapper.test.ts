import { startOfToday } from 'date-fns'
import toPlanCreationScheduleDto from './planCreationScheduleDtoMapper'
import { aValidPlanCreationScheduleResponse } from '../../testsupport/planCreationScheduleResponseTestDataBuilder'
import PlanCreationScheduleStatus from '../../enums/planCreationScheduleStatus'
import aValidPlanCreationScheduleDto from '../../testsupport/planCreationScheduleDtoTestDataBuilder'

describe('planCreationScheduleDtoMapper', () => {
  describe('toPlanCreationScheduleDto', () => {
    it('should map a PlanCreationScheduleResponse with a deadline date to a PlanCreationScheduleDto', () => {
      // Given
      const prisonNumber = 'A1234BC'
      const deadlineDate = startOfToday()

      const apiResponse = aValidPlanCreationScheduleResponse({
        deadlineDate,
        status: PlanCreationScheduleStatus.COMPLETED,
      })

      const expected = aValidPlanCreationScheduleDto({
        prisonNumber,
        status: PlanCreationScheduleStatus.COMPLETED,
        deadlineDate,
      })

      // When
      const actual = toPlanCreationScheduleDto(prisonNumber, apiResponse)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map a PlanCreationScheduleResponse without a deadline date to a PlanCreationScheduleDto', () => {
      // Given
      const prisonNumber = 'A1234BC'

      const apiResponse = aValidPlanCreationScheduleResponse({
        deadlineDate: null,
        status: PlanCreationScheduleStatus.COMPLETED,
      })

      const expected = aValidPlanCreationScheduleDto({
        prisonNumber,
        status: PlanCreationScheduleStatus.COMPLETED,
        deadlineDate: null,
      })

      // When
      const actual = toPlanCreationScheduleDto(prisonNumber, apiResponse)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
