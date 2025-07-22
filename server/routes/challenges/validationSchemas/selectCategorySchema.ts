import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import ChallengeType from '../../../enums/challengeType'

const selectCategorySchema = async () => {
  const categoryMandatoryMessage = 'Select a category'

  return createSchema({
    category: z //
      .enum(ChallengeType, { message: categoryMandatoryMessage }),
  })
}

export default selectCategorySchema
