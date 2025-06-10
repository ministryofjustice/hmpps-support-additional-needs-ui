import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import YesNoValue from '../../../enums/yesNoValue'

const wereOtherPeopleConsultedSchema = async () => {
  const wereOtherPeopleConsultedMandatoryMessage =
    'Select whether other people where consulted in the creation of the plan'

  return createSchema({
    wereOtherPeopleConsulted: z //
      .nativeEnum(YesNoValue, { message: wereOtherPeopleConsultedMandatoryMessage }),
  })
}

export default wereOtherPeopleConsultedSchema
