import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'
import { isEmpty, textValueExceedsLength } from '../../../utils/validation/textValueValidator'

const learningNeedsSupportPractitionerSupportSchema =
  (options: { journey: 'create' | 'review' } = { journey: 'create' }) =>
  async () => {
    const MAX_DETAILS_LENGTH = 4000
    const MIN_SUPPORT_HOURS = 0

    const messages = {
      create: {
        supportRequiredMandatoryMessage: 'Select if you recommend the person has specific learning needs support',
        detailsMandatoryMessage: 'Enter details of any support required',
        detailsMaxLengthMessage: `Details of required support must be ${MAX_DETAILS_LENGTH} characters or less`,
        supportHoursMessage: 'You must enter a number of hours of support even if that number is 0',
      },
      review: {
        supportRequiredMandatoryMessage: 'Select if you recommend the person has specific learning needs support',
        detailsMandatoryMessage: 'Enter details of recommended support',
        detailsMaxLengthMessage: `Details of required support must be ${MAX_DETAILS_LENGTH} characters or less`,
        supportHoursMessage: 'Enter recommended number of hours',
      },
    }

    return createSchema({
      supportRequired: z //
        .enum(YesNoValue, { message: messages[options.journey].supportRequiredMandatoryMessage }),
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
            message: messages[options.journey].detailsMandatoryMessage,
          })
        } else if (textValueExceedsLength(details, MAX_DETAILS_LENGTH)) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value,
            path: ['details'],
            message: messages[options.journey].detailsMaxLengthMessage,
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
            message: messages[options.journey].supportHoursMessage,
          })
        }
      }
    })
  }

export default learningNeedsSupportPractitionerSupportSchema
