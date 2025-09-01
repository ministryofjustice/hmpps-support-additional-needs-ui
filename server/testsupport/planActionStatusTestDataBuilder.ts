import type { PlanActionStatus } from 'supportAdditionalNeedsApiClient'

const aPlanActionStatus = (options?: {
  status?:
    | 'PLAN_OVERDUE'
    | 'PLAN_DUE'
    | 'REVIEW_OVERDUE'
    | 'REVIEW_DUE'
    | 'ACTIVE_PLAN'
    | 'NEEDS_PLAN'
    | 'INACTIVE_PLAN'
    | 'PLAN_DECLINED'
    | 'NO_PLAN'
  planCreationDeadlineDate?: string
  reviewDeadlineDate?: string
  exemptionReason?: 'EXEMPT_REFUSED_TO_ENGAGE' | 'EXEMPT_NOT_REQUIRED' | 'EXEMPT_INACCURATE_IDENTIFICATION'
  exemptionDetail?: string
}): PlanActionStatus => ({
  status: options?.status || 'PLAN_DECLINED',
  planCreationDeadlineDate:
    options?.planCreationDeadlineDate === null ? null : options?.planCreationDeadlineDate || '2021-01-01',
  reviewDeadlineDate: options?.reviewDeadlineDate === null ? null : options?.reviewDeadlineDate || '2021-01-01',
  exemptionReason: options?.exemptionReason === null ? null : options?.exemptionReason || 'EXEMPT_REFUSED_TO_ENGAGE',
  exemptionDetail:
    options?.exemptionDetail === null
      ? null
      : options?.exemptionDetail || 'Chris feels he does not need a support plan',
})

export default aPlanActionStatus
