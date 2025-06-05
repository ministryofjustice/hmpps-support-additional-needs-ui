import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'

const specificTeachingSkillsSchema = async () => {
  const adjustmentsRequiredMandatoryMessage = 'Select whether any specific teaching skills are required'
  const detailsMandatoryMessage = 'Enter details of any specific teaching skills'

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

export default specificTeachingSkillsSchema
