import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'

const specificTeachingSkillsSchema = async () => {
  const skillsRequiredMandatoryMessage = 'Select whether any specific teaching skills are required'
  const detailsMandatoryMessage = 'Enter details of any specific teaching skills'

  return createSchema({
    skillsRequired: z //
      .nativeEnum(YesNoValue, { message: skillsRequiredMandatoryMessage }),
    details: z //
      .string()
      .nullable()
      .optional(),
  }).refine(
    ({ skillsRequired, details }) => {
      if (skillsRequired === YesNoValue.YES) {
        return details?.length > 0
      }
      return true
    },
    { path: ['details'], message: detailsMandatoryMessage },
  )
}

export default specificTeachingSkillsSchema
