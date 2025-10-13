import { addMonths, startOfToday, parse } from 'date-fns'
import { createSchema, dateIsWithinInterval } from '../../../middleware/validationMiddleware'
import config from '../../../config'

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
  }).refine(
    reviewDate => {
      if (config.featureToggles.reviewsEnabled) {
        return true
      }
      // Whilst the review journey is not enabled we need to prevent users entering October 2025 review dates
      const date = parse(reviewDate.reviewDate as string, 'dd/MM/yyyy', new Date())
      const isOctober2025 = date.getFullYear() === 2025 && date.getMonth() === 9
      return !isOctober2025
    },
    { path: ['reviewDate'], message: 'Review date cannot be in October 2025' },
  )
}

export default reviewSupportPlanSchema
