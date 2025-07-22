import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import StrengthType from '../../../enums/strengthType'
import { asArray } from '../../../utils/utils'

const addStrengthsSchema = async () => {
  const strengthTypeCodeMandatoryMessage = `Select all strengths that were identified on the screener, or select 'No strengths identified'`
  const strengthTypeCodeNoneMustBeExclusiveMessage = `It is not valid to select 1 or more strengths and 'No strengths identified'`

  return createSchema({
    strengthTypeCodes: z //
      .preprocess(
        asArray,
        z.enum(StrengthType, strengthTypeCodeMandatoryMessage).array().min(1, strengthTypeCodeMandatoryMessage),
      ),
  }).refine(
    ({ strengthTypeCodes }) => {
      if (strengthTypeCodes?.length > 1) {
        return !strengthTypeCodes.includes(StrengthType.NONE)
      }
      return true
    },
    { path: ['strengthTypeCodes'], message: strengthTypeCodeNoneMustBeExclusiveMessage },
  )
}

export default addStrengthsSchema
