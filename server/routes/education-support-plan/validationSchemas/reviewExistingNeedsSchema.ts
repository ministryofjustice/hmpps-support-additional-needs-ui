import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'

const reviewExistingNeedsSchema = async () => {
  const reviewExistingNeedsMandatoryMessage =
    'Select whether you would like to review strengths, challenges and support needs before creating the plan'

  return createSchema({
    reviewBeforeCreatingPlan: z //
      .enum(YesNoValue, { message: reviewExistingNeedsMandatoryMessage }),
  })
}

export default reviewExistingNeedsSchema
