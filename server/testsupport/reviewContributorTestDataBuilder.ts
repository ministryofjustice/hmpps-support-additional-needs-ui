import type { ReviewContributor } from 'supportAdditionalNeedsApiClient'

const aReviewContributor = (options?: { name?: string; jobRole?: string }): ReviewContributor => ({
  name: options?.name || 'Alan Teacher',
  jobRole: options?.jobRole || 'Education Instructor',
})

export default aReviewContributor
