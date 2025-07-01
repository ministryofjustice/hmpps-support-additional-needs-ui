import toUpdatePlanCreationStatusRequest from './updatePlanCreationStatusRequestMapper'
import aValidRefuseEducationSupportPlanDto from '../../testsupport/refuseEducationSupportPlanDtoTestDataBuilder'
import PlanCreationScheduleExemptionReason from '../../enums/planCreationScheduleExemptionReason'
import aValidUpdatePlanCreationStatusRequest from '../../testsupport/updatePlanCreationStatusRequestTestDataBuilder'
import PlanCreationScheduleStatus from '../../enums/planCreationScheduleStatus'

describe('updatePlanCreationStatusRequestMapper', () => {
  describe('toUpdatePlanCreationStatusRequest', () => {
    it('should map a RefuseEducationSupportPlanDto to a UpdatePlanCreationStatusRequest', () => {
      // Given
      const prisonId = 'MDI'
      const prisonNumber = 'A1234BC'
      const dto = aValidRefuseEducationSupportPlanDto({
        prisonNumber,
        prisonId,
        reason: PlanCreationScheduleExemptionReason.EXEMPT_INACCURATE_IDENTIFICATION,
        details: 'Chris does not agree that he has ADHD and does not want a plan',
      })

      const expected = aValidUpdatePlanCreationStatusRequest({
        prisonId,
        status: PlanCreationScheduleStatus.EXEMPT_PRISONER_NOT_COMPLY,
        exemptionReason: PlanCreationScheduleExemptionReason.EXEMPT_INACCURATE_IDENTIFICATION,
        exemptionDetail: 'Chris does not agree that he has ADHD and does not want a plan',
      })
      // When
      const actual = toUpdatePlanCreationStatusRequest(dto)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
