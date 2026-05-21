import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import DeleteReason from '../../../enums/deleteReason'

const deleteReasonValues = Object.values(DeleteReason) as [DeleteReason, ...DeleteReason[]]

const deleteReasonSchema = () => async () =>
  createSchema({
    deleteReason: z //
      .enum(deleteReasonValues, {
        message: 'Add reason for deleting screener challenges and strengths',
      }),
  })

export default deleteReasonSchema
