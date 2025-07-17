import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import ChallengeCategory from '../../../enums/challengeCategory'

const selectCategorySchema = async () => {
  const categoryMandatoryMessage = 'Select a category'

  return createSchema({
    category: z //
      .enum(ChallengeCategory, { message: categoryMandatoryMessage }),
  })
}

export default selectCategorySchema
