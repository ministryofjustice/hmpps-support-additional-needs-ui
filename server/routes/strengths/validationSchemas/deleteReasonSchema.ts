import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import DeleteReason from '../../../enums/deleteReason'

const deleteReasonValues = Object.values(DeleteReason) as [DeleteReason, ...DeleteReason[]]

const deleteReasonSchema =
  (options: { mode: 'active' | 'history' } = { mode: 'active' }) =>
  async () => {
    const messages = {
      active: { mandatoryMessage: 'Add reason for deleting strength' },
      history: { mandatoryMessage: 'Add reason for deleting history strength' },
    }

    return createSchema({
      deleteReason: z //
        .enum(deleteReasonValues, {
          message: messages[options.mode].mandatoryMessage,
        }),
    })
  }

export default deleteReasonSchema
