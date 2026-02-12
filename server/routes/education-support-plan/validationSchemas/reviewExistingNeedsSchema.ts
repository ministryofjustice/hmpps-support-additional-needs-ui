import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'

const reviewExistingNeedsSchema =
  (options: { journey: 'create' | 'review' } = { journey: 'create' }) =>
  async () => {
    const messages = {
      create: {
        reviewExistingNeedsMandatoryMessage: `You must confirm that you have reviewed the person's support strategies, challenges, strengths and conditions`,
      },
      review: {
        reviewExistingNeedsMandatoryMessage: `You must confirm that you have reviewed the person's support strategies, challenges, strengths and conditions`,
      },
    }

    return createSchema({
      reviewExistingNeeds: z //
        .enum(YesNoValue, { message: messages[options.journey].reviewExistingNeedsMandatoryMessage }),
    })
  }

export default reviewExistingNeedsSchema
