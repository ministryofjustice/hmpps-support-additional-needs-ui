import type { PlanContributor } from 'supportAdditionalNeedsApiClient'

const aValidPlanContributor = (options?: { name?: string; jobRole?: string }): PlanContributor => ({
  name: options?.name || 'Alan Teacher',
  jobRole: options?.jobRole || 'Education Instructor',
})

export default aValidPlanContributor
