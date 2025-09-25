import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'
import { isEmpty, textValueExceedsLength } from '../../../utils/validation/textValueValidator'

const teachingAdjustmentsSchema = async () => {
  const MAX_DETAILS_LENGTH = 4000

  const adjustmentsRequiredMandatoryMessage =
    'Select if the person needs any adjustments to teaching, learning environment or materials'
  const detailsMandatoryMessage = 'Add details of the adjustments needed to teaching, learning environment or materials'
  const detailsMaxLengthMessage = `Details of adjustments to the teaching must be ${MAX_DETAILS_LENGTH} characters or less`

  return createSchema({
    adjustmentsNeeded: z //
      .enum(YesNoValue, { message: adjustmentsRequiredMandatoryMessage }),
    details: z //
      .string()
      .trim()
      .nullable()
      .optional(),
  })
    .refine(
      ({ adjustmentsNeeded, details }) => {
        if (adjustmentsNeeded === YesNoValue.YES) {
          return !isEmpty(details)
        }
        return true
      },
      { path: ['details'], message: detailsMandatoryMessage },
    )
    .refine(
      ({ adjustmentsNeeded, details }) => {
        if (adjustmentsNeeded === YesNoValue.YES) {
          return !textValueExceedsLength(details, MAX_DETAILS_LENGTH)
        }
        return true
      },
      { path: ['details'], message: detailsMaxLengthMessage },
    )
}

export default teachingAdjustmentsSchema
