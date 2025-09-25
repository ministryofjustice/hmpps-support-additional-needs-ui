import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'
import { isEmpty, textValueExceedsLength } from '../../../utils/validation/textValueValidator'

const examArrangementsSchema = async () => {
  const MAX_DETAILS_LENGTH = 4000

  const arrangementsRequiredMandatoryMessage = 'Select if access arrangements are needed for exams or assessments'
  const detailsMandatoryMessage = 'Enter details of access arrangements needed for exams or assessments'
  const detailsMaxLengthMessage = `Details of access arrangements must be ${MAX_DETAILS_LENGTH} characters or less`

  return createSchema({
    arrangementsNeeded: z //
      .enum(YesNoValue, { message: arrangementsRequiredMandatoryMessage }),
    details: z //
      .string()
      .trim()
      .nullable()
      .optional(),
  })
    .refine(
      ({ arrangementsNeeded, details }) => {
        if (arrangementsNeeded === YesNoValue.YES) {
          return !isEmpty(details)
        }
        return true
      },
      { path: ['details'], message: detailsMandatoryMessage },
    )
    .refine(
      ({ arrangementsNeeded, details }) => {
        if (arrangementsNeeded === YesNoValue.YES) {
          return !textValueExceedsLength(details, MAX_DETAILS_LENGTH)
        }
        return true
      },
      { path: ['details'], message: detailsMaxLengthMessage },
    )
}

export default examArrangementsSchema
