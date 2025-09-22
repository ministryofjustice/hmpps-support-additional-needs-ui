import { z } from 'zod'
import { createSchema } from '../../../../middleware/validationMiddleware'
import PlanCreationScheduleExemptionReason from '../../../../enums/planCreationScheduleExemptionReason'
import { isEmpty, textValueExceedsLength } from '../../../../utils/validation/textValueValidator'

const reasonSchema = async () => {
  const MAX_REFUSAL_REASON_DETAILS_LENGTH = 200

  const refusalReasonMandatoryMessage = 'Select the reason an education support plan has been declined'
  const refusalReasonDetailsMaxLengthMessage = `Refusal details must be ${MAX_REFUSAL_REASON_DETAILS_LENGTH} characters or less`
  const detailsMandatoryMessage = 'Enter details'

  return createSchema({
    refusalReason: z //
      .enum(PlanCreationScheduleExemptionReason, { message: refusalReasonMandatoryMessage }),
    refusalReasonDetails: z //
      .record(z.enum(PlanCreationScheduleExemptionReason), z.string().trim().nullable().optional())
      .nullable()
      .optional(),
  }).check(ctx => {
    const { refusalReason, refusalReasonDetails } = ctx.value
    if (!refusalReasonDetails?.[refusalReason] || isEmpty(refusalReasonDetails?.[refusalReason])) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        path: [`${refusalReason}_refusalDetails`],
        message: detailsMandatoryMessage,
      })
    } else if (
      refusalReasonDetails?.[refusalReason] &&
      textValueExceedsLength(refusalReasonDetails[refusalReason], MAX_REFUSAL_REASON_DETAILS_LENGTH)
    ) {
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
