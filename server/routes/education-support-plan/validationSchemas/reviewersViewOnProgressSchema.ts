import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'

const reviewersViewOnProgressSchema = async () => {
  const MAX_REVIEWERS_VIEW_ON_PROGRESS_LENGTH = 4000

  const viewOnProgressMandatoryMessage = `Enter reviewer's view on person's progress`
  const viewOnProgressMaxLengthMessage = `The reviewer's view on the person's progress must be ${MAX_REVIEWERS_VIEW_ON_PROGRESS_LENGTH} characters or less`

  return createSchema({
    reviewersViewOnProgress: z //
      .string({ message: viewOnProgressMandatoryMessage })
      .trim()
      .min(1, viewOnProgressMandatoryMessage)
      .max(MAX_REVIEWERS_VIEW_ON_PROGRESS_LENGTH, viewOnProgressMaxLengthMessage),
  })
}

export default reviewersViewOnProgressSchema
