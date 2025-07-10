import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'
import { isEmpty, textValueExceedsLength } from '../../../utils/validation/textValueValidator'

const specificTeachingSkillsSchema = async () => {
  const MAX_DETAILS_LENGTH = 4000

  const skillsRequiredMandatoryMessage = 'Select whether any specific teaching skills are required'
  const detailsMandatoryMessage = 'Enter details of any specific teaching skills'
  const detailsMaxLengthMessage = `Details of specific teaching skills must be ${MAX_DETAILS_LENGTH} characters or less`

  return createSchema({
    skillsRequired: z //
      .enum(YesNoValue, { message: skillsRequiredMandatoryMessage }),
    details: z //
      .string()
      .nullable()
      .optional(),
  })
    .refine(
      ({ skillsRequired, details }) => {
        if (skillsRequired === YesNoValue.YES) {
          return !isEmpty(details)
        }
        return true
      },
      { path: ['details'], message: detailsMandatoryMessage },
    )
    .refine(
      ({ skillsRequired, details }) => {
        if (skillsRequired === YesNoValue.YES) {
          return !textValueExceedsLength(details, MAX_DETAILS_LENGTH)
        }
        return true
      },
      { path: ['details'], message: detailsMaxLengthMessage },
    )
}

export default specificTeachingSkillsSchema
