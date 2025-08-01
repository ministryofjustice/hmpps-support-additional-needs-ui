import { Request, Response } from 'express'
import { z } from 'zod'
import { createSchema } from '../../../middleware/validationMiddleware'
import ConditionType from '../../../enums/conditionType'
import ApplicationAction from '../../../enums/applicationAction'
import ConditionSource from '../../../enums/conditionSource'

const detailsSchema = async (req: Request, res: Response) => {
  const MAX_CONDITION_DETAILS_LENGTH = 4000

  const conditionDetailsMandatoryMessage = 'Enter details of the conditions'
  const conditionDetailMandatoryMessage = 'Enter details of the condition'
  const conditionDetailMaxLengthMessage = `The condition detail must be ${MAX_CONDITION_DETAILS_LENGTH} characters or less`
  const conditionDiagnosisMandatoryMessage = 'Select whether the condition was self-declared or diagnosed'

  const userShouldRecordConditionDiagnosisSource = res.locals.userHasPermissionTo(
    ApplicationAction.RECORD_DIAGNOSED_CONDITIONS,
  )

  return createSchema({
    conditionDetails: z //
      .record(z.enum(ConditionType), z.string().trim().nullable().optional(), conditionDetailsMandatoryMessage),
    conditionDiagnosis: z //
      .record(z.enum(ConditionType), z.string().nullable().optional())
      .nullable()
      .optional(),
  }).check(ctx => {
    const conditionDetails = Object.entries(ctx.value.conditionDetails || {}).filter(
      ([_conditionType, conditionDetail]) => conditionDetail != null,
    ) as Array<[ConditionType, string]>

    const conditionDiagnosis =
      Object.entries(ctx.value.conditionDiagnosis || {})
        .filter(([_conditionType, conditionSource]) => conditionSource != null)
        .reduce(
          (acc, [conditionType, conditionSource]) => {
            acc[conditionType as ConditionType] = conditionSource
            return acc
          },
          {} as Record<ConditionType, string>,
        ) || ({} as Record<ConditionType, string>)

    if (conditionDetails.length === 0) {
      ctx.issues.push({
        code: 'custom',
        input: ctx.value,
        path: ['conditionDetails'],
        message: conditionDetailsMandatoryMessage,
      })
      return
    }

    conditionDetails.forEach(condition => {
      const [conditionType, conditionDetail] = condition
      if (conditionDetail.length === 0) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: [`${conditionType}_details`],
          message: conditionDetailMandatoryMessage,
        })
      } else if (conditionDetail.length > MAX_CONDITION_DETAILS_LENGTH) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value,
          path: [`${conditionType}_details`],
          message: conditionDetailMaxLengthMessage,
        })
      }

      // Perform additional validation if the user should have also submitted condition diagnosis source due to them having the RECORD_DIAGNOSED_CONDITIONS permission
      // (ie. whether each condition has been specified as being either self-declared or diagnosed)
      if (userShouldRecordConditionDiagnosisSource) {
        if (Object.values(ConditionSource).includes(conditionDiagnosis[conditionType] as ConditionSource) === false) {
          ctx.issues.push({
            code: 'custom',
            input: ctx.value,
            path: [`conditionDiagnosis[${conditionType}]`],
            message: conditionDiagnosisMandatoryMessage,
          })
        }
      }
    })
  })
}

export default detailsSchema
