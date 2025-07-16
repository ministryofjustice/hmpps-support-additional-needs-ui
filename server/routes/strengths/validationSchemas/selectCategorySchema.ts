import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import StrengthCategory from '../../../enums/strengthCategory'

const selectCategorySchema = async () => {
  const categoryMandatoryMessage = 'Select a category'

  return createSchema({
    category: z //
      .enum(StrengthCategory, { message: categoryMandatoryMessage }),
  })
}

export default selectCategorySchema
