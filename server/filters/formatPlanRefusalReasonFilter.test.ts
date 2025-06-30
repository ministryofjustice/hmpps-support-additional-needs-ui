import formatPlanRefusalReasonFilter from './formatPlanRefusalReasonFilter'
import PlanCreationScheduleExemptionReason from '../enums/planCreationScheduleExemptionReason'

describe('formatPlanRefusalReasonFilter', () => {
  it.each([
    {
      source: PlanCreationScheduleExemptionReason.EXEMPT_REFUSED_TO_ENGAGE,
      expected: 'Has refused to engage or cooperate',
    },
    {
      source: PlanCreationScheduleExemptionReason.EXEMPT_NOT_REQUIRED,
      expected: 'No support plan currently required',
    },
    {
      source: PlanCreationScheduleExemptionReason.EXEMPT_INACCURATE_IDENTIFICATION,
      expected: 'Declined due to inaccurate identification of need',
    },
  ])('should format $source as $expected', ({ source, expected }) => {
    expect(formatPlanRefusalReasonFilter(source)).toEqual(expected)
  })
})
