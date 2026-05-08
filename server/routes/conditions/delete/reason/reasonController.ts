import { NextFunction, Request, Response } from 'express'
import type { ConditionDto } from 'dto'
import { ConditionService } from '../../../../services'

export default class ReasonController {
  constructor(private readonly conditionService: ConditionService) {}

  getReasonView = async (req: Request, res: Response, _next: NextFunction) => {
    const { invalidForm, prisonerSummary } = res.locals
    const conditionDto = req.journeyData.conditionDto as ConditionDto

    const form = invalidForm ?? { deleteReason: '' }

    const viewRenderArgs = {
      prisonerSummary,
      mode: 'active',
      dto: conditionDto,
      form,
    }

    return res.render('pages/conditions/delete/reason/index', viewRenderArgs)
  }

  submitReasonForm = async (req: Request, res: Response, _next: NextFunction) => {
    const { deleteReason } = req.body

    const conditionDto = req.journeyData.conditionDto as ConditionDto
    conditionDto.deleteReason = deleteReason
    req.journeyData.conditionDto = conditionDto

    return res.redirect('review')
  }
}
