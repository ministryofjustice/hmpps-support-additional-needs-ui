import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import ChallengeType from '../../../enums/challengeType'
import { asArray } from '../../../utils/utils'

const addChallengesSchema = async () => {
  const challengeTypeCodeMandatoryMessage = `Select all challenges that were identified on the screener, or select 'No challenges identified'`
  const challengeTypeCodeNoneMustBeExclusiveMessage = `It is not valid to select 1 or more challenges and 'No challenges identified'`

  return createSchema({
    challengeTypeCodes: z //
      .preprocess(
        asArray,
        z.enum(ChallengeType, challengeTypeCodeMandatoryMessage).array().min(1, challengeTypeCodeMandatoryMessage),
      ),
  }).refine(
    ({ challengeTypeCodes }) => {
      if (challengeTypeCodes?.length > 1) {
        return !challengeTypeCodes.includes(ChallengeType.NONE)
      }
      return true
    },
    { path: ['challengeTypeCodes'], message: challengeTypeCodeNoneMustBeExclusiveMessage },
  )
}

export default addChallengesSchema
