import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ConditionDto, ConditionsList } from 'dto'
import { asArray } from '../../../../utils/utils'
import ConditionType from '../../../../enums/conditionType'
import ConditionSource from '../../../../enums/conditionSource'
import { PrisonUser } from '../../../../interfaces/hmppsUser'
import conditionsThatRequireNaming from '../../conditionsThatRequireNaming'

export default class SelectConditionsController {
  getSelectConditionsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm, prisonerSummary } = res.locals
    const { conditionsList } = req.journeyData

    const selectConditionsForm = invalidForm
      ? {
          ...invalidForm,
          conditions: asArray(invalidForm.conditions),
        }
      : this.populateFormFromDto(conditionsList)

    const viewRenderArgs = { prisonerSummary, form: selectConditionsForm, conditionsThatRequireNaming }
    return res.render('pages/conditions/select-conditions/index', viewRenderArgs)
  }

  submitSelectConditionsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const selectConditionsForm = { ...req.body }
    const { activeCaseLoadId } = res.locals.user as PrisonUser

    this.updateDtoFromForm(req, selectConditionsForm, activeCaseLoadId)

    return res.redirect('details')
  }

  private populateFormFromDto = (dto: ConditionsList) => {
    return {
      conditions: dto.conditions.map(condition => condition.conditionTypeCode),
    }
  }

  private updateDtoFromForm = (
    req: Request,
    form: { conditions: Array<ConditionType>; conditionNames: Record<ConditionType, string> },
    prisonId: string,
  ) => {
    const { conditionsList } = req.journeyData
    conditionsList.conditions = form.conditions.map(
      condition =>
        ({
          prisonId,
          conditionTypeCode: condition,
          conditionName: form.conditionNames[condition],
          conditionDetails: undefined,
          source: ConditionSource.SELF_DECLARED, // populate this field from the form; RR-1705
        }) as ConditionDto,
    )
    req.journeyData.conditionsList = conditionsList
  }
}
