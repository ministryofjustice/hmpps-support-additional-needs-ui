import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'

const examArrangementsSchema = async () => {
  const arrangementsRequiredMandatoryMessage = 'Select whether any access arrangements are required'
  const detailsMandatoryMessage = 'Enter details of any access arrangements'

  return createSchema({
    arrangementsNeeded: z //
      .nativeEnum(YesNoValue, { message: arrangementsRequiredMandatoryMessage }),
    details: z //
      .string()
      .nullable()
      .optional(),
  }).refine(
    ({ arrangementsNeeded, details }) => {
      if (arrangementsNeeded === YesNoValue.YES) {
        return details?.length > 0
      }
      return true
    },
    { path: ['details'], message: detailsMandatoryMessage },
  )
}

export default examArrangementsSchema
