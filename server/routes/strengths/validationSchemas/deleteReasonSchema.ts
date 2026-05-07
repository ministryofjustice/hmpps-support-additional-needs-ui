import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'

const deleteReasonSchema =
  (options: { mode: 'active' | 'history' } = { mode: 'active' }) =>
  async () => {
    const messages = {
      active: { mandatoryMessage: 'Add reason for deleting strength' },
      history: { mandatoryMessage: 'Add reason for deleting history strength' },
    }

    return createSchema({
      deleteReason: z //
        .enum(['DATA_PROCESSING_OBJECTION', 'ENTERED_IN_ERROR'], {
          message: messages[options.mode].mandatoryMessage,
        }),
    })
  }

export default deleteReasonSchema
