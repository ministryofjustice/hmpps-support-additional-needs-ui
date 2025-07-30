import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ConditionDto, ConditionsList } from 'dto'
import ConditionType from '../../../../enums/conditionType'
import { ConditionService } from '../../../../services'
import { Result } from '../../../../utils/result/result'

export default class DetailsController {
  constructor(private readonly conditionService: ConditionService) {}

  getDetailsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm, prisonerSummary } = res.locals
    const { conditionsList } = req.journeyData

    const selectDetailsForm = invalidForm ?? this.populateFormFromDto(conditionsList)

    const viewRenderArgs = { prisonerSummary, form: selectDetailsForm, dto: conditionsList }
    return res.render('pages/conditions/details/index', viewRenderArgs)
  }

  submitDetailsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const detailsForm = { ...req.body }
    this.updateDtoFromForm(req, detailsForm)

    const { conditionsList } = req.journeyData
    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.conditionService.createConditions(req.user.username, conditionsList),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('details')
    }

    const { prisonNumber } = conditionsList
    req.journeyData.conditionsList = undefined
    return res.redirectWithSuccess(`/profile/${prisonNumber}/conditions`, 'Condition(s) updated')
  }

  private populateFormFromDto = (dto: ConditionsList) => {
    return {
      conditionDetails: Object.fromEntries(
        dto.conditions.map(condition => [condition.conditionTypeCode, condition.conditionDetails ?? '']),
      ),
    }
  }

  private updateDtoFromForm = (req: Request, form: { conditionDetails: Record<ConditionType, string> }) => {
    const { conditionsList } = req.journeyData
    Object.entries(form.conditionDetails)
      .filter(([_conditionType, conditionDetail]) => conditionDetail != null)
      .forEach(([conditionType, details]) => {
        ;(conditionsList.conditions as Array<ConditionDto>).find(
          condition => condition.conditionTypeCode === conditionType,
        ).conditionDetails = details
      })
    req.journeyData.conditionsList = conditionsList
  }
}
