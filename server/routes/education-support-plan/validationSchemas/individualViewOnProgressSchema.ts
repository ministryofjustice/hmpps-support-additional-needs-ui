import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'

const individualViewOnProgressSchema = async () => {
  const MAX_PRISONER_VIEW_ON_PROGRESS_LENGTH = 4000

  const prisonerViewOnProgressMaxLengthMessage = `The individual's view on their progress must be ${MAX_PRISONER_VIEW_ON_PROGRESS_LENGTH} characters or less`

  return createSchema({
    prisonerViewOnProgress: z //
      .string()
      .trim()
      .max(MAX_PRISONER_VIEW_ON_PROGRESS_LENGTH, prisonerViewOnProgressMaxLengthMessage)
      .nullable()
      .optional(),
    prisonerDeclinedBeingPartOfReview: z.coerce //
      .boolean()
      .nullable()
      .optional(),
  }).check(ctx => {
    const { prisonerViewOnProgress, prisonerDeclinedBeingPartOfReview } = ctx.value
    if (!prisonerViewOnProgress && !prisonerDeclinedBeingPartOfReview) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        path: ['prisonerViewOnProgress'],
        message: 'Enter details of how person feels about progress or select if review declined',
      })
    } else if (prisonerViewOnProgress && prisonerDeclinedBeingPartOfReview) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        path: ['prisonerViewOnProgress'],
        message: 'You cannot enter progress details and select the declined review box. Complete one option only.',
      })
    }
  })
}

export default individualViewOnProgressSchema
