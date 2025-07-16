import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import StrengthIdentificationSource from '../../../enums/strengthIdentificationSource'
import { isEmpty, textValueExceedsLength } from '../../../utils/validation/textValueValidator'
import { asArray } from '../../../utils/utils'

const detailSchema = async () => {
  const DETAIL_MAX_LENGTH = 4000
  const HOW_IDENTIFIED_OTHER_MAX_LENGTH = 200

  const detailMandatoryMessage = 'Enter a description of the strength'
  const detailMaxLengthMessage = `Description of the strength must be ${DETAIL_MAX_LENGTH} characters or less`
  const howIdentifiedMandatoryMessage = 'Select at least one option for how this strength was identified'
  const howIdentifiedOtherMandatoryMessage = 'Enter details of how this strength was identified'
  const howIdentifiedOtherMaxLengthMessage = `How this strength was identified must be ${HOW_IDENTIFIED_OTHER_MAX_LENGTH} characters or less`

  return createSchema({
    description: z //
      .string({ message: detailMandatoryMessage })
      .trim()
      .min(1, detailMandatoryMessage)
      .max(DETAIL_MAX_LENGTH, detailMaxLengthMessage),
    howIdentified: z //
      .preprocess(
        asArray,
        z
          .enum(StrengthIdentificationSource, howIdentifiedMandatoryMessage)
          .array()
          .min(1, howIdentifiedMandatoryMessage),
      ),
    howIdentifiedOther: z //
      .string()
      .trim()
      .nullable()
      .optional(),
  })
    .refine(
      ({ howIdentified, howIdentifiedOther }) => {
        if (asArray(howIdentified).includes(StrengthIdentificationSource.OTHER)) {
          return !isEmpty(howIdentifiedOther)
        }
        return true
      },
      { path: ['howIdentifiedOther'], message: howIdentifiedOtherMandatoryMessage },
    )
    .refine(
      ({ howIdentified, howIdentifiedOther }) => {
        if (asArray(howIdentified).includes(StrengthIdentificationSource.OTHER)) {
          return !textValueExceedsLength(howIdentifiedOther, HOW_IDENTIFIED_OTHER_MAX_LENGTH)
        }
        return true
      },
      { path: ['howIdentifiedOther'], message: howIdentifiedOtherMaxLengthMessage },
    )
}

export default detailSchema
