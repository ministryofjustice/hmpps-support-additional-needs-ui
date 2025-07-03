import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'

const individualSupportRequirementsSchema = async () => {
  const MAX_SUPPORT_REQUIREMENTS_LENGTH = 4000

  const supportRequirementsMandatoryMessage =
    'Enter details of any support requirements that the individual feels they need'
  const supportRequirementsMaxLengthMessage = `Any support requirements that the individual feels they need must be ${MAX_SUPPORT_REQUIREMENTS_LENGTH} characters or less`

  return createSchema({
    supportRequirements: z //
      .string({ message: supportRequirementsMandatoryMessage })
      .min(1, supportRequirementsMandatoryMessage)
      .max(MAX_SUPPORT_REQUIREMENTS_LENGTH, supportRequirementsMaxLengthMessage),
  })
}

export default individualSupportRequirementsSchema
