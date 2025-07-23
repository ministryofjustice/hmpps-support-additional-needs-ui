import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import StrengthType from '../../../enums/strengthType'

const selectCategorySchema = async () => {
  const categoryMandatoryMessage = 'Select a category'

  return createSchema({
    category: z //
      .enum(StrengthType, { message: categoryMandatoryMessage }),
  })
}

export default selectCategorySchema
