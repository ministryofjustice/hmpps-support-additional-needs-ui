import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import PlanCreatedByValue from '../../../enums/planCreatedByValue'

const whoCompletedThePlanSchema = async () => {
  const MAX_COMPLETED_BY_FULL_NAME_LENGTH = 200
  const MAX_COMPLETED_BY_JOB_ROLE_LENGTH = 200

  const completedByMandatoryMessage = 'Select whether you met with the person to create their plan'
  const completedByFullNameMandatoryMessage =
    'Enter the full name of the person who met with the person to create their plan'
  const completedByFullNameMaxLengthMessage = `Full name must be ${MAX_COMPLETED_BY_FULL_NAME_LENGTH} characters or less`
  const completedByJobRoleMandatoryMessage =
    'Enter the job title of the person who met with the person to create their plan'
  const completedByJobRoleMaxLengthMessage = `Job role must be ${MAX_COMPLETED_BY_JOB_ROLE_LENGTH} characters or less`

  return createSchema({
    completedBy: z //
      .enum(PlanCreatedByValue, { message: completedByMandatoryMessage }),
    completedByOtherFullName: z //
      .string()
      .trim()
      .max(MAX_COMPLETED_BY_FULL_NAME_LENGTH, completedByFullNameMaxLengthMessage)
      .nullable()
      .optional(),
    completedByOtherJobRole: z //
      .string()
      .trim()
      .max(MAX_COMPLETED_BY_JOB_ROLE_LENGTH, completedByJobRoleMaxLengthMessage)
      .nullable()
      .optional(),
  })
    .refine(
      ({ completedBy, completedByOtherFullName }) => {
        if (completedBy === PlanCreatedByValue.SOMEBODY_ELSE) {
          return (completedByOtherFullName ?? '') !== ''
        }
        return true
      },
      {
        path: ['completedByOtherFullName'],
        message: completedByFullNameMandatoryMessage,
      },
    )
    .refine(
      ({ completedBy, completedByOtherJobRole }) => {
        if (completedBy === PlanCreatedByValue.SOMEBODY_ELSE) {
          return (completedByOtherJobRole ?? '') !== ''
        }
        return true
      },
      {
        path: ['completedByOtherJobRole'],
        message: completedByJobRoleMandatoryMessage,
      },
    )
}

export default whoCompletedThePlanSchema
