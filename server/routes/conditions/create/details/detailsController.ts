import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ConditionDto, ConditionsList } from 'dto'
import ConditionType from '../../../../enums/conditionType'

export default class DetailsController {
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
    const { prisonNumber } = conditionsList
    // TODO - map DTO to request and call API via service to save Conditions

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
