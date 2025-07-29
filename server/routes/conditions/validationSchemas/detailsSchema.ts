import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import ConditionType from '../../../enums/conditionType'

const detailsSchema = async () => {
  const MAX_CONDITION_DETAILS_LENGTH = 4000

  const conditionDetailsMandatoryMessage = 'Enter details of the conditions'
  const conditionDetailMandatoryMessage = 'Enter details of the condition'
  const conditionDetailMaxLengthMessage = `The condition detail must be ${MAX_CONDITION_DETAILS_LENGTH} characters or less`

  return createSchema({
    conditionDetails: z //
      .record(z.enum(ConditionType), z.string().trim().nullable().optional(), conditionDetailsMandatoryMessage),
  }).check(ctx => {
    const conditionDetails = Object.entries(ctx.value.conditionDetails || {}).filter(
      ([_conditionType, conditionDetail]) => conditionDetail != null,
    )

    if (conditionDetails.length === 0) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        path: ['conditionDetails'],
        message: conditionDetailsMandatoryMessage,
      })
      return
    }

    conditionDetails.forEach(condition => {
      const [conditionType, conditionDetail] = condition
      if (conditionDetail.length === 0) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: [`${conditionType}_details`],
          message: conditionDetailMandatoryMessage,
        })
      } else if (conditionDetail.length > MAX_CONDITION_DETAILS_LENGTH) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: [`${conditionType}_details`],
          message: conditionDetailMaxLengthMessage,
        })
      }
    })
  })
}

export default detailsSchema
