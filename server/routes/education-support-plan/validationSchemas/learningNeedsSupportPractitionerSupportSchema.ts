import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'
import { isEmpty, textValueExceedsLength } from '../../../utils/validation/textValueValidator'

const learningNeedsSupportPractitionerSupportSchema = async () => {
  const MAX_DETAILS_LENGTH = 4000
  const MIN_SUPPORT_HOURS = 0

  const supportRequiredMandatoryMessage = 'Select whether any support from an LNSP is required'
  const detailsMandatoryMessage = 'Enter details of any support required'
  const detailsMaxLengthMessage = `Details of required support must be ${MAX_DETAILS_LENGTH} characters or less`
  const supportHoursMessage = `You must enter a number of hours of support even if that number is 0`

  return createSchema({
    supportRequired: z //
      .enum(YesNoValue, { message: supportRequiredMandatoryMessage }),
    details: z //
      .string()
      .trim()
      .nullable()
      .optional(),
    supportHours: z.coerce //
      .string()
      .trim()
      .nullable()
      .optional(),
  }).check(ctx => {
    const { supportRequired, details, supportHours } = ctx.value
    if (supportRequired === YesNoValue.YES) {
      if (isEmpty(details)) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['details'],
          message: detailsMandatoryMessage,
        })
      } else if (textValueExceedsLength(details, MAX_DETAILS_LENGTH)) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['details'],
          message: detailsMaxLengthMessage,
        })
      }

      if (
        supportHours == null ||
        supportHours === '' ||
        Number.isNaN(Number(supportHours)) ||
        Number(supportHours) < MIN_SUPPORT_HOURS
      ) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['supportHours'],
          message: supportHoursMessage,
        })
      }
    }
  })
}

export default learningNeedsSupportPractitionerSupportSchema
