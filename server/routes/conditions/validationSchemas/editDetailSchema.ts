import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import ConditionSource from '../../../enums/conditionSource'
import conditionsThatRequireNaming from '../conditionsThatRequireNaming'
import { isEmpty, textValueExceedsLength } from '../../../utils/validation/textValueValidator'

const editDetailSchema = async (req: Request, res: Response) => {
  const MAX_CONDITION_DETAILS_LENGTH = 4000
  const MAX_CONDITION_NAME_LENGTH = 200

  const conditionDetailMandatoryMessage = 'Enter details of the condition'
  const conditionDetailMaxLengthMessage = `The condition detail must be ${MAX_CONDITION_DETAILS_LENGTH} characters or less`
  const conditionSourceMandatoryMessage = 'Select whether the condition was self-declared or diagnosed'
  const conditionNameMandatoryMessage = 'Specify the condition'
  const conditionNameMaxLengthMessage = `Condition name must be ${MAX_CONDITION_NAME_LENGTH} characters or less`

  const { conditionTypeCode } = req.journeyData.conditionDto

  return createSchema({
    conditionDetails: z //
      .string(conditionDetailMandatoryMessage)
      .min(1, conditionDetailMandatoryMessage)
      .max(MAX_CONDITION_DETAILS_LENGTH, conditionDetailMaxLengthMessage),
    conditionSource: z //
      .enum(ConditionSource, conditionSourceMandatoryMessage),
    conditionName: z //
      .string()
      .optional()
      .nullable(),
  }).check(ctx => {
    const { conditionName } = ctx.value

    if (conditionsThatRequireNaming.includes(conditionTypeCode)) {
      if (isEmpty(conditionName)) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['conditionName'],
          message: conditionNameMandatoryMessage,
        })
      } else if (textValueExceedsLength(conditionName, MAX_CONDITION_NAME_LENGTH)) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: ['conditionName'],
          message: conditionNameMaxLengthMessage,
        })
      }
    }
  })
}

export default editDetailSchema
