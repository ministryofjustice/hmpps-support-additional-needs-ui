import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import PlanReviewedByValue from '../../../enums/planReviewedByValue'

const whoReviewedThePlanSchema = async () => {
  const MAX_REVIEWED_BY_FULL_NAME_LENGTH = 200
  const MAX_REVIEWED_BY_JOB_ROLE_LENGTH = 200

  const reviewedByMandatoryMessage = 'Select if you are reviewing the plan with the prisoner'
  const reviewedByFullNameMandatoryMessage = `Enter the person's full name`
  const reviewedByFullNameMaxLengthMessage = `Full name must be ${MAX_REVIEWED_BY_FULL_NAME_LENGTH} characters or less`
  const reviewedByJobRoleMandatoryMessage = `Enter the person's job role`
  const reviewedByJobRoleMaxLengthMessage = `Job role must be ${MAX_REVIEWED_BY_JOB_ROLE_LENGTH} characters or less`
  const reviewedByFullNameJobRoleMandatoryMessage = `Enter the person's full name and job role`

  return createSchema({
    reviewedBy: z //
      .enum(PlanReviewedByValue, { message: reviewedByMandatoryMessage }),
    reviewedByOtherFullName: z //
      .string()
      .trim()
      .max(MAX_REVIEWED_BY_FULL_NAME_LENGTH, reviewedByFullNameMaxLengthMessage)
      .nullable()
      .optional(),
    reviewedByOtherJobRole: z //
      .string()
      .trim()
      .max(MAX_REVIEWED_BY_JOB_ROLE_LENGTH, reviewedByJobRoleMaxLengthMessage)
      .nullable()
      .optional(),
  }).check(ctx => {
    const { reviewedBy, reviewedByOtherFullName, reviewedByOtherJobRole } = ctx.value
    if (reviewedBy === PlanReviewedByValue.SOMEBODY_ELSE) {
      if (reviewedByOtherFullName && reviewedByOtherJobRole) {
        return
      }
      if (!reviewedByOtherFullName && !reviewedByOtherJobRole) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['reviewedBy'],
          message: reviewedByFullNameJobRoleMandatoryMessage,
        })
      } else if (!reviewedByOtherFullName) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['reviewedByOtherFullName'],
          message: reviewedByFullNameMandatoryMessage,
        })
      } else {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['reviewedByOtherJobRole'],
          message: reviewedByJobRoleMandatoryMessage,
        })
      }
    }
  })
}

export default whoReviewedThePlanSchema
