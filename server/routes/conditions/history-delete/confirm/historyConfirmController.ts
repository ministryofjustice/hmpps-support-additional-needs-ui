import { NextFunction, Request, Response } from 'express'
import type { ConditionDto } from 'dto'
import { AuditService, ConditionService } from '../../../../services'
import { BaseAuditData } from '../../../../services/auditService'
import { Result } from '../../../../utils/result/result'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

export default class HistoryConfirmController {
  constructor(
    private readonly conditionService: ConditionService,
    private readonly auditService: AuditService,
  ) {}

  getConfirmView = async (req: Request, res: Response, _next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const conditionDto = req.journeyData.conditionDto as ConditionDto

    const viewRenderArgs = {
      prisonerSummary,
      mode: 'history',
      dto: conditionDto,
      errorDeletingCondition: req.flash('pageHasApiErrors')[0] != null,
    }

    return res.render('pages/conditions/delete/confirm/index', viewRenderArgs)
  }

  submitConfirmForm = async (req: Request, res: Response, _next: NextFunction) => {
    const { activeCaseLoadId, username } = res.locals.user as PrisonUser
    const dto = req.journeyData.conditionDto as ConditionDto
    const { reference, prisonNumber, deleteReason } = dto

    const { apiErrorCallback } = res.locals
    const result = await Result.wrap(
      this.conditionService.deleteCondition(username, prisonNumber, reference, activeCaseLoadId, deleteReason),
      apiErrorCallback,
    )
    if (!result.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('confirm')
    }

    req.journeyData.conditionDto = undefined
    this.auditService.logDeleteCondition(this.deleteConditionAuditData(req, dto))
    return res.redirectWithSuccess(
      `/profile/${prisonNumber}/conditions#archived-conditions`,
      'History condition deleted.',
    )
  }

  private deleteConditionAuditData = (req: Request, dto: ConditionDto): BaseAuditData => {
    return {
      details: {
        conditionReference: dto.reference,
        mode: 'history',
      },
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}
