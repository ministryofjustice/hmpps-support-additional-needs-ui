import { parseISO, startOfDay } from 'date-fns'
import type { PlanActionStatus } from 'supportAdditionalNeedsApiClient'
import toPlanLifecycleStatusDto from './planLifecycleStatusDtoMapper'
import aPlanActionStatus from '../../testsupport/planActionStatusTestDataBuilder'
import aPlanLifecycleStatusDto from '../../testsupport/planLifecycleStatusDtoTestDataBuilder'
import PlanActionStatusEnum from '../../enums/planActionStatus'
import PlanCreationScheduleExemptionReason from '../../enums/planCreationScheduleExemptionReason'

describe('planLifecycleStatusDtoMapper', () => {
  describe('toPlanLifecycleStatusDto', () => {
    it('should map a PlanActionStatus describing an ELSP that has not yet been created to a PlanLifecycleStatusDto', () => {
      // Given
      const planActionStatus = aPlanActionStatus({
        status: 'PLAN_DUE',
        planCreationDeadlineDate: '2021-01-01',
        reviewDeadlineDate: null,
        exemptionReason: null,
        exemptionDetail: null,
        exemptionRecordedBy: null,
        exemptionRecordedAt: null,
      })

      const expected = aPlanLifecycleStatusDto({
        status: PlanActionStatusEnum.PLAN_DUE,
        planCreationDeadlineDate: startOfDay('2021-01-01'),
        reviewDeadlineDate: null,
        planDeclined: null,
      })

      // When
      const actual = toPlanLifecycleStatusDto(planActionStatus)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map a PlanActionStatus describing an ELSP that has been declined to a PlanLifecycleStatusDto', () => {
      // Given
      const planActionStatus = aPlanActionStatus({
        status: 'PLAN_DECLINED',
        planCreationDeadlineDate: '2021-01-01',
        reviewDeadlineDate: null,
        exemptionReason: 'EXEMPT_NOT_REQUIRED',
        exemptionDetail: 'Chris does not want a plan',
        exemptionRecordedBy: 'Alex Smith',
        exemptionRecordedAt: '2021-01-02T14:32:16.126Z',
      })

      const expected = aPlanLifecycleStatusDto({
        status: PlanActionStatusEnum.PLAN_DECLINED,
        planCreationDeadlineDate: startOfDay('2021-01-01'),
        reviewDeadlineDate: null,
        planDeclined: {
          reason: PlanCreationScheduleExemptionReason.EXEMPT_NOT_REQUIRED,
          details: 'Chris does not want a plan',
          recordedBy: 'Alex Smith',
          recordedAt: parseISO('2021-01-02T14:32:16.126Z'),
        },
      })

      // When
      const actual = toPlanLifecycleStatusDto(planActionStatus)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map a PlanActionStatus describing an ELSP that has been created to a PlanLifecycleStatusDto', () => {
      // Given
      const planActionStatus = aPlanActionStatus({
        status: 'REVIEW_DUE',
        planCreationDeadlineDate: '2021-01-01',
        reviewDeadlineDate: '2021-03-01',
        exemptionReason: null,
        exemptionDetail: null,
        exemptionRecordedBy: null,
        exemptionRecordedAt: null,
      })

      const expected = aPlanLifecycleStatusDto({
        status: PlanActionStatusEnum.REVIEW_DUE,
        planCreationDeadlineDate: startOfDay('2021-01-01'),
        reviewDeadlineDate: startOfDay('2021-03-01'),
        planDeclined: null,
      })

      // When
      const actual = toPlanLifecycleStatusDto(planActionStatus)

      // Then
      expect(actual).toEqual(expected)
    })

    it('should map a null PlanActionStatus to a "NO_PLAN" PlanLifecycleStatusDto', () => {
      // Given
      const planActionStatus: PlanActionStatus = null

      const expected = aPlanLifecycleStatusDto({
        status: PlanActionStatusEnum.NO_PLAN,
        planCreationDeadlineDate: null,
        reviewDeadlineDate: null,
        planDeclined: null,
      })

      // When
      const actual = toPlanLifecycleStatusDto(planActionStatus)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
