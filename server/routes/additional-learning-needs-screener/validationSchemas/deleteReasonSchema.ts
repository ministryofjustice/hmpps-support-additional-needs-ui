import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'

const deleteReasonSchema = () => async () =>
  createSchema({
    deleteReason: z //
      .enum(['DATA_PROCESSING_OBJECTION', 'ENTERED_IN_ERROR'], {
        message: 'Add reason for deleting screener challenges and strengths',
      }),
  })

export default deleteReasonSchema
