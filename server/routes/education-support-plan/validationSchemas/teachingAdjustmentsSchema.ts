import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'

const teachingAdjustmentsSchema = async () => {
  const adjustmentsRequiredMandatoryMessage = 'Select whether any adjustments are required to the teaching'
  const detailsMandatoryMessage = 'Enter details of any adjustments to the teaching'

  return createSchema({
    adjustmentsNeeded: z //
      .nativeEnum(YesNoValue, { message: adjustmentsRequiredMandatoryMessage }),
    details: z //
      .string()
      .nullable()
      .optional(),
  }).refine(
    ({ adjustmentsNeeded, details }) => {
      if (adjustmentsNeeded === YesNoValue.YES) {
        return details?.length > 0
      }
      return true
    },
    { path: ['details'], message: detailsMandatoryMessage },
  )
}

export default teachingAdjustmentsSchema
