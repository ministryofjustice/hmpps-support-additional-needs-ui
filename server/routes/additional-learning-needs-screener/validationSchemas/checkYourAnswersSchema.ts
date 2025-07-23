import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'

const checkYourAnswersSchema = async () => {
  const screenerInformationIsCorrectMandatoryMessage = 'You must confirm that the screener information is correct'

  return createSchema({
    screenerInformationIsCorrect: z //
      .union([z.string(), z.literal(true)], screenerInformationIsCorrectMandatoryMessage),
  }).refine(
    ({ screenerInformationIsCorrect }) => {
      return screenerInformationIsCorrect?.toString().toLowerCase() === 'true'
    },
    { path: ['screenerInformationIsCorrect'], message: screenerInformationIsCorrectMandatoryMessage },
  )
}

export default checkYourAnswersSchema
