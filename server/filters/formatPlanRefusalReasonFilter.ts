import PlanCreationScheduleExemptionReason from '../enums/planCreationScheduleExemptionReason'

export default function formatPlanRefusalReasonFilter(value: PlanCreationScheduleExemptionReason): string {
  const planRefusalReasonValue = PlanRefusalReasonValues[value as keyof typeof PlanCreationScheduleExemptionReason]
  return planRefusalReasonValue
}

enum PlanRefusalReasonValues {
  EXEMPT_REFUSED_TO_ENGAGE = 'Has refused to engage or cooperate',
  EXEMPT_NOT_REQUIRED = 'No support plan currently required',
  EXEMPT_INACCURATE_IDENTIFICATION = 'Declined due to inaccurate identification of need',
}
