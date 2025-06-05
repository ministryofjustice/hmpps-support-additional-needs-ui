import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'

const learningNeedsSupportPractitionerSupportSchema = async () => {
  const supportRequiredMandatoryMessage = 'Select whether any support from an LNSP is required'
  const detailsMandatoryMessage = 'Enter details of any support required'

  return createSchema({
    supportRequired: z //
      .nativeEnum(YesNoValue, { message: supportRequiredMandatoryMessage }),
    details: z //
      .string()
      .nullable()
      .optional(),
  }).refine(
    ({ supportRequired, details }) => {
      if (supportRequired === YesNoValue.YES) {
        return details?.length > 0
      }
      return true
    },
    { path: ['details'], message: detailsMandatoryMessage },
  )
}

export default learningNeedsSupportPractitionerSupportSchema
