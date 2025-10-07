import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'

const wereOtherPeopleConsultedSchema =
  (options: { journey: 'create' | 'review' } = { journey: 'create' }) =>
  async () => {
    const messages = {
      create: {
        wereOtherPeopleConsultedMandatoryMessage:
          'Select whether other people were consulted in the creation of the plan',
      },
      review: {
        wereOtherPeopleConsultedMandatoryMessage: 'Select if other people were consulted or involved',
      },
    }

    return createSchema({
      wereOtherPeopleConsulted: z //
        .enum(YesNoValue, { message: messages[options.journey].wereOtherPeopleConsultedMandatoryMessage }),
    })
  }

export default wereOtherPeopleConsultedSchema
