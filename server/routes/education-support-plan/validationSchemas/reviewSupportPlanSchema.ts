import { addMonths, startOfToday } from 'date-fns'
import { createSchema, dateIsWithinInterval } from '../../../middleware/validationMiddleware'

const reviewSupportPlanSchema = async () => {
  const reviewDateMandatoryMessage = 'Enter a valid date'
  const reviewDateInvalidMessage = 'Enter a valid date'
  const reviewDateNotInRangeMessage = 'Enter a review date within the next 3 months'

  return createSchema({
    reviewDate: dateIsWithinInterval({
      mandatoryMessage: reviewDateMandatoryMessage,
      invalidFormatMessage: reviewDateInvalidMessage,
      invalidMessage: reviewDateNotInRangeMessage,
      start: startOfToday(),
      end: addMonths(startOfToday(), 3),
    }),
  })
}

export default reviewSupportPlanSchema
