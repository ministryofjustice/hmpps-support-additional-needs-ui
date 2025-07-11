import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'

const addPersonConsultedSchema = async () => {
  const MAX_COMPLETED_BY_FULL_NAME_LENGTH = 200

  const fullNameMandatoryMessage =
    'Enter the full name of the person was was consulted or involved in the creation of the plan'
  const fullNameMaxLengthMessage = `Full name must be ${MAX_COMPLETED_BY_FULL_NAME_LENGTH} characters or less`

  return createSchema({
    fullName: z //
      .string({ message: fullNameMandatoryMessage })
      .trim()
      .min(1, fullNameMandatoryMessage)
      .max(MAX_COMPLETED_BY_FULL_NAME_LENGTH, fullNameMaxLengthMessage),
  })
}

export default addPersonConsultedSchema
