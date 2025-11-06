import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import { asArray } from '../../../utils/utils'
import ConditionType from '../../../enums/conditionType'
import { textValueExceedsLength } from '../../../utils/validation/textValueValidator'
import conditionsThatRequireNaming from '../conditionsThatRequireNaming'

const selectConditionsSchema = async () => {
  const CONDITION_NAME_MAX_LENGTH = 200

  const conditionTypeCodeMandatoryMessage = 'Select all conditions that the person has'
  const conditionNameMandatoryMessage = 'Specify the condition'
  const conditionNameMaxLengthMessage = `Condition name must be ${CONDITION_NAME_MAX_LENGTH} characters or less`

  return createSchema({
    conditions: z //
      .preprocess(
        asArray,
        z.enum(ConditionType, conditionTypeCodeMandatoryMessage).array().min(1, conditionTypeCodeMandatoryMessage),
      ),
    conditionNames: z //
      .record(z.enum(ConditionType), z.string().trim().nullable().optional())
      .nullable()
      .optional(),
  }).check(ctx => {
    const { conditions, conditionNames } = ctx.value

    asArray(conditions).forEach(conditionType => {
      if (conditionsThatRequireNaming.includes(conditionType)) {
        // this condition is one that requires the additional detail field
        if (
          !conditionNames ||
          !Object.prototype.hasOwnProperty.call(conditionNames, conditionType) ||
          !conditionNames[conditionType] ||
          conditionNames[conditionType].trim().length === 0
        ) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value,
            path: [`${conditionType}_conditionNames`],
            message: conditionNameMandatoryMessage,
          })
        } else if (textValueExceedsLength(conditionNames[conditionType], CONDITION_NAME_MAX_LENGTH)) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value,
            path: [`${conditionType}_conditionNames`],
            message: conditionNameMaxLengthMessage,
          })
        }
      }
    })
  })
}

export default selectConditionsSchema
