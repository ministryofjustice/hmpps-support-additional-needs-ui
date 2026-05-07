import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'

const deleteReasonSchema =
  (options: { mode: 'active' | 'history' } = { mode: 'active' }) =>
  async () => {
    const messages = {
      active: { mandatoryMessage: 'Add reason for deleting condition' },
      history: { mandatoryMessage: 'Add reason for deleting history condition' },
    }

    return createSchema({
      deleteReason: z //
        .enum(['DATA_PROCESSING_OBJECTION', 'ENTERED_IN_ERROR'], {
          message: messages[options.mode].mandatoryMessage,
        }),
    })
  }

export default deleteReasonSchema
