import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'

const detailSchema = async () => {
  const DETAIL_MAX_LENGTH = 4000

  const detailMandatoryMessage = 'Enter a description of the support strategy'
  const detailMaxLengthMessage = `Description of the support strategy must be ${DETAIL_MAX_LENGTH} characters or less`

  return createSchema({
    description: z //
      .string({ message: detailMandatoryMessage })
      .trim()
      .min(1, detailMandatoryMessage)
      .max(DETAIL_MAX_LENGTH, detailMaxLengthMessage),
  })
}

export default detailSchema
