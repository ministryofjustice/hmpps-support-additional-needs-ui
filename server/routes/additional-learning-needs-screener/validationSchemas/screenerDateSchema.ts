import { createSchema, dateIsTodayOrInThePast } from '../../../middleware/validationMiddleware'

const screenerDateSchema = async () => {
  const screenerDateMandatoryMessage = 'Enter a valid date'
  const screenerDateInvalidMessage = 'Enter a valid date'
  const screenerDateInFutureMessage = 'The screener date cannot be a future date'

  return createSchema({
    screenerDate: dateIsTodayOrInThePast({
      mandatoryMessage: screenerDateMandatoryMessage,
      invalidFormatMessage: screenerDateInvalidMessage,
      invalidMessage: screenerDateInFutureMessage,
    }),
  })
}

export default screenerDateSchema
