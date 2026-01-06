import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'
import config from '../../../config'

const reviewExistingNeedsSchema =
  (options: { journey: 'create' | 'review' } = { journey: 'create' }) =>
  async () => {
    const messages = {
      create: {
        reviewExistingNeedsMandatoryMessage: `${config.featureToggles.newEspJourneyEnabled ? 'You must review' : 'Select whether you would like to review'} strengths, challenges and support needs before creating the plan`,
      },
      review: {
        reviewExistingNeedsMandatoryMessage: `${config.featureToggles.newEspJourneyEnabled ? 'You must review' : 'Select if you want to review'} challenges, strengths, conditions and support strategies before reviewing the education support plan`,
      },
    }

    return createSchema({
      reviewExistingNeeds: z //
        .enum(YesNoValue, { message: messages[options.journey].reviewExistingNeedsMandatoryMessage }),
    })
  }

export default reviewExistingNeedsSchema
