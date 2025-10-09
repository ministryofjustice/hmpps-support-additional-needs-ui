import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'
import { isEmpty, textValueExceedsLength } from '../../../utils/validation/textValueValidator'

const specificTeachingSkillsSchema =
  (options: { journey: 'create' | 'review' } = { journey: 'create' }) =>
  async () => {
    const MAX_DETAILS_LENGTH = 4000

    const messages = {
      create: {
        skillsRequiredMandatoryMessage: `Select if teachers need specific knowledge or skills to support person's learning`,
        detailsMandatoryMessage: `Enter the details of teachers' specific knowledge or skills`,
        detailsMaxLengthMessage: `Details of specific teaching skills must be ${MAX_DETAILS_LENGTH} characters or less`,
      },
      review: {
        skillsRequiredMandatoryMessage: `Select if teachers need specific knowledge or skills to support person's learning`,
        detailsMandatoryMessage: 'Enter details for teachers needing specific knowledge or skills',
        detailsMaxLengthMessage: `Details of specific teaching skills must be ${MAX_DETAILS_LENGTH} characters or less`,
      },
    }

    return createSchema({
      skillsRequired: z //
        .enum(YesNoValue, { message: messages[options.journey].skillsRequiredMandatoryMessage }),
      details: z //
        .string()
        .trim()
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
        { path: ['details'], message: messages[options.journey].detailsMandatoryMessage },
      )
      .refine(
        ({ skillsRequired, details }) => {
          if (skillsRequired === YesNoValue.YES) {
            return !textValueExceedsLength(details, MAX_DETAILS_LENGTH)
          }
          return true
        },
        { path: ['details'], message: messages[options.journey].detailsMaxLengthMessage },
      )
  }

export default specificTeachingSkillsSchema
