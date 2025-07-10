import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'
import { isEmpty, textValueExceedsLength } from '../../../utils/validation/textValueValidator'

const learningEnvironmentAdjustmentsSchema = async () => {
  const MAX_DETAILS_LENGTH = 4000

  const adjustmentsRequiredMandatoryMessage = 'Select whether any adjustments are required to the learning environment'
  const detailsMandatoryMessage = 'Enter details of any adjustments to the learning environment'
  const detailsMaxLengthMessage = `Details of adjustments to the learning environment must be ${MAX_DETAILS_LENGTH} characters or less`

  return createSchema({
    adjustmentsNeeded: z //
      .enum(YesNoValue, { message: adjustmentsRequiredMandatoryMessage }),
    details: z //
      .string()
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

export default learningEnvironmentAdjustmentsSchema
