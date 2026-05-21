import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import DeleteReason from '../../../enums/deleteReason'

const deleteReasonSchema = () => async () =>
  createSchema({
    deleteReason: z //
      .enum(DeleteReason, {
        message: 'Add reason for deleting screener challenges and strengths',
      }),
  })

export default deleteReasonSchema
