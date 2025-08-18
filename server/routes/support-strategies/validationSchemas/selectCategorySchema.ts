import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import SupportStrategyType from '../../../enums/supportStrategyType'

const selectCategorySchema = async () => {
  const categoryMandatoryMessage = 'Select a category'

  return createSchema({
    category: z //
      .enum(SupportStrategyType, { message: categoryMandatoryMessage }),
  })
}

export default selectCategorySchema
