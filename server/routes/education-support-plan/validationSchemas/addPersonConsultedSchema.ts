import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'

const addPersonConsultedSchema = async () => {
  const MAX_COMPLETED_BY_FULL_NAME_LENGTH = 200
  const MAX_JOB_ROLE_LENGTH = 200

  const fullNameMandatoryMessage =
    'Enter the full name of the person who was consulted or involved in the creation of the plan'
  const fullNameMaxLengthMessage = `Full name must be ${MAX_COMPLETED_BY_FULL_NAME_LENGTH} characters or less`
  const jobRoleMandatoryMessage =
    'Enter the job role of the person who was consulted or involved in the creation of the plan'
  const jobRoleMaxLengthMessage = `Job role must be ${MAX_JOB_ROLE_LENGTH} characters or less`

  return createSchema({
    fullName: z //
      .string({ message: fullNameMandatoryMessage })
      .trim()
      .min(1, fullNameMandatoryMessage)
      .max(MAX_COMPLETED_BY_FULL_NAME_LENGTH, fullNameMaxLengthMessage),
    jobRole: z //
      .string({ message: jobRoleMandatoryMessage })
      .trim()
      .min(1, jobRoleMandatoryMessage)
      .max(MAX_COMPLETED_BY_FULL_NAME_LENGTH, jobRoleMaxLengthMessage),
  })
}

export default addPersonConsultedSchema
