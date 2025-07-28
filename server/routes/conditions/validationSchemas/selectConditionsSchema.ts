import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import { asArray } from '../../../utils/utils'
import ConditionType from '../../../enums/conditionType'
import { textValueExceedsLength } from '../../../utils/validation/textValueValidator'

const selectConditionsSchema = async () => {
  const CONDITION_TYPES_REQUIRING_DETAILS = [
    ConditionType.LD_OTHER,
    ConditionType.MENTAL_HEALTH,
    ConditionType.NEURODEGEN,
    ConditionType.PHYSICAL_OTHER,
    ConditionType.VISUAL_IMPAIR,
    ConditionType.OTHER,
    ConditionType.DLD_OTHER,
    ConditionType.LEARN_DIFF_OTHER,
    ConditionType.LONG_TERM_OTHER,
    ConditionType.NEURO_OTHER,
  ]
  const CONDITION_DETAIL_MAX_LENGTH = 200

  const conditionTypeCodeMandatoryMessage = 'Select all conditions that the person has'
  const conditionDetailMandatoryMessage = 'Enter the details of the condition'
  const conditionDetailMaxLengthMessage = `Condition details must be ${CONDITION_DETAIL_MAX_LENGTH} characters or less`

  return createSchema({
    conditions: z //
      .preprocess(
        asArray,
        z.enum(ConditionType, conditionTypeCodeMandatoryMessage).array().min(1, conditionTypeCodeMandatoryMessage),
      ),
    conditionDetails: z //
      .record(z.enum(ConditionType), z.string().trim().nullable().optional())
      .nullable()
      .optional(),
  }).check(ctx => {
    const { conditions, conditionDetails } = ctx.value

    asArray(conditions).forEach(conditionType => {
      if (CONDITION_TYPES_REQUIRING_DETAILS.includes(conditionType)) {
        // this condition is one that requires the additional detail field
        if (
          !conditionDetails ||
          !Object.prototype.hasOwnProperty.call(conditionDetails, conditionType) ||
          !conditionDetails[conditionType] ||
          conditionDetails[conditionType].trim().length === 0
        ) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value,
            path: [`${conditionType}_conditionDetails`],
            message: conditionDetailMandatoryMessage,
          })
        } else if (textValueExceedsLength(conditionDetails[conditionType], CONDITION_DETAIL_MAX_LENGTH)) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value,
            path: [`${conditionType}_conditionDetails`],
            message: conditionDetailMaxLengthMessage,
          })
        }
      }
    })
  })
}

export default selectConditionsSchema
