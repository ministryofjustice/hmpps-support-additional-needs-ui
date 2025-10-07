import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'

const addPersonConsultedSchema =
  (options: { journey: 'create' | 'review' } = { journey: 'create' }) =>
  async () => {
    const MAX_COMPLETED_BY_FULL_NAME_LENGTH = 200
    const MAX_JOB_ROLE_LENGTH = 200

    const messages = {
      create: {
        fullNameMandatoryMessage:
          'Enter the full name of the person who was consulted or involved in the creation of the plan',
        fullNameMaxLengthMessage: `Full name must be ${MAX_COMPLETED_BY_FULL_NAME_LENGTH} characters or less`,
        jobRoleMandatoryMessage:
          'Enter the job role of the person who was consulted or involved in the creation of the plan',
        jobRoleMaxLengthMessage: `Job role must be ${MAX_JOB_ROLE_LENGTH} characters or less`,
      },
      review: {
        fullNameMandatoryMessage: `Enter the person's full name`,
        fullNameMaxLengthMessage: `Full name must be ${MAX_COMPLETED_BY_FULL_NAME_LENGTH} characters or less`,
        jobRoleMandatoryMessage: `Enter the person's job role`,
        jobRoleMaxLengthMessage: `Job role must be ${MAX_JOB_ROLE_LENGTH} characters or less`,
      },
    }

    return createSchema({
      fullName: z //
        .string({ message: messages[options.journey].fullNameMandatoryMessage })
        .trim()
        .min(1, messages[options.journey].fullNameMandatoryMessage)
        .max(MAX_COMPLETED_BY_FULL_NAME_LENGTH, messages[options.journey].fullNameMaxLengthMessage),
      jobRole: z //
        .string({ message: messages[options.journey].jobRoleMandatoryMessage })
        .trim()
        .min(1, messages[options.journey].jobRoleMandatoryMessage)
        .max(MAX_COMPLETED_BY_FULL_NAME_LENGTH, messages[options.journey].jobRoleMaxLengthMessage),
    })
  }

export default addPersonConsultedSchema
