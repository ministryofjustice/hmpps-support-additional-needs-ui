import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'

const additionalInformationSchema = async () => {
  const MAX_ADDITIONAL_INFORMATION_LENGTH = 4000

  const additionalInformationMaxLengthMessage = `Any additional information must be ${MAX_ADDITIONAL_INFORMATION_LENGTH} characters or less`

  return createSchema({
    additionalInformation: z //
      .string()
      .trim()
      .max(MAX_ADDITIONAL_INFORMATION_LENGTH, additionalInformationMaxLengthMessage)
      .nullable()
      .optional(),
  })
}

export default additionalInformationSchema
