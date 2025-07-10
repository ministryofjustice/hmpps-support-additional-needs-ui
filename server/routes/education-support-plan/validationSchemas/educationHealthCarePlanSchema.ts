import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'

const educationHealthCarePlanSchema = async () => {
  const ehcpMandatoryMessage = 'Select whether there is a current EHCP in place'

  return createSchema({
    hasCurrentEhcp: z //
      .enum(YesNoValue, { message: ehcpMandatoryMessage }),
  })
}

export default educationHealthCarePlanSchema
