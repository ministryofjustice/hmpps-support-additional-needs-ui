import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import DeleteReason from '../../../enums/deleteReason'

const deleteReasonValues = Object.values(DeleteReason) as [DeleteReason, ...DeleteReason[]]

const deleteReasonSchema =
  (options: { mode: 'active' | 'history' } = { mode: 'active' }) =>
  async () => {
    const messages = {
      active: { mandatoryMessage: 'Add reason for deleting support strategy' },
      history: { mandatoryMessage: 'Add reason for deleting history support strategy' },
    }

    return createSchema({
      deleteReason: z //
        .enum(deleteReasonValues, {
          message: messages[options.mode].mandatoryMessage,
        }),
    })
  }

export default deleteReasonSchema
