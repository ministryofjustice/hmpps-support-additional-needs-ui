import { z } from 'zod'
import { createSchema } from '../../../../middleware/validationMiddleware'
import PlanCreationScheduleExemptionReason from '../../../../enums/planCreationScheduleExemptionReason'
import { textValueExceedsLength } from '../../../../utils/validation/textValueValidator'

const reasonSchema = async () => {
  const MAX_REFUSAL_REASON_DETAILS_LENGTH = 200

  const refusalReasonMandatoryMessage = 'Select the reason that the education support plan is being refused'
  const refusalReasonDetailsMaxLengthMessage = `Refusal details must be ${MAX_REFUSAL_REASON_DETAILS_LENGTH} characters or less`

  return createSchema({
    refusalReason: z //
      .enum(PlanCreationScheduleExemptionReason, { message: refusalReasonMandatoryMessage }),
    refusalReasonDetails: z //
      .record(z.enum(PlanCreationScheduleExemptionReason), z.string().trim().nullable().optional())
      .nullable()
      .optional(),
  }).check(ctx => {
    const { refusalReason, refusalReasonDetails } = ctx.value
    if (!refusalReasonDetails || !Object.prototype.hasOwnProperty.call(refusalReasonDetails, refusalReason)) {
      return
    }
    if (textValueExceedsLength(refusalReasonDetails[refusalReason], MAX_REFUSAL_REASON_DETAILS_LENGTH)) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        path: [`${refusalReason}_refusalDetails`],
        message: refusalReasonDetailsMaxLengthMessage,
      })
    }
  })
}

export default reasonSchema
