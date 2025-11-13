import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'

const archiveReasonSchema = async () => {
  const ARCHIVE_REASON_MAX_LENGTH = 4000

  const archiveReasonMandatoryMessage = 'Add reason for moving this condition to the History'
  const archiveReasonMaxLengthMessage = `Reason for moving this condition to the History must be ${ARCHIVE_REASON_MAX_LENGTH} characters or less`

  return createSchema({
    archiveReason: z //
      .string({ message: archiveReasonMandatoryMessage })
      .trim()
      .min(1, archiveReasonMandatoryMessage)
      .max(ARCHIVE_REASON_MAX_LENGTH, archiveReasonMaxLengthMessage),
  })
}

export default archiveReasonSchema
