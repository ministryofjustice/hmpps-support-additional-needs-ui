import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'
import { isEmpty, textValueExceedsLength } from '../../../utils/validation/textValueValidator'

const learningNeedsSupportPractitionerSupportSchema = async () => {
  const MAX_DETAILS_LENGTH = 4000

  const supportRequiredMandatoryMessage = 'Select whether any support from an LNSP is required'
  const detailsMandatoryMessage = 'Enter details of any support required'
  const detailsMaxLengthMessage = `Details of required support must be ${MAX_DETAILS_LENGTH} characters or less`

  return createSchema({
    supportRequired: z //
      .enum(YesNoValue, { message: supportRequiredMandatoryMessage }),
    details: z //
      .string()
      .trim()
      .nullable()
      .optional(),
  })
    .refine(
      ({ supportRequired, details }) => {
        if (supportRequired === YesNoValue.YES) {
          return !isEmpty(details)
        }
        return true
      },
      { path: ['details'], message: detailsMandatoryMessage },
    )
    .refine(
      ({ supportRequired, details }) => {
        if (supportRequired === YesNoValue.YES) {
          return !textValueExceedsLength(details, MAX_DETAILS_LENGTH)
        }
        return true
      },
      { path: ['details'], message: detailsMaxLengthMessage },
    )
}

export default learningNeedsSupportPractitionerSupportSchema
