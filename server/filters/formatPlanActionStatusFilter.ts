import SearchPlanStatus from '../enums/planActionStatus'

const planActionStatusScreenValues: Record<SearchPlanStatus, string> = {
  PLAN_OVERDUE: 'Plan overdue',
  PLAN_DUE: 'Plan due',
  REVIEW_OVERDUE: 'Review overdue',
  REVIEW_DUE: 'Review due',
  ACTIVE_PLAN: 'Active plan',
  NEEDS_PLAN: 'Needs plan',
  INACTIVE_PLAN: 'Inactive plan',
  PLAN_DECLINED: 'Plan declined',
  NO_PLAN: 'No plan',
}

const formatPlanActionStatusFilter = (value: SearchPlanStatus): string => planActionStatusScreenValues[value]

export default formatPlanActionStatusFilter
