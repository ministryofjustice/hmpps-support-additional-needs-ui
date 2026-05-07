import { NextFunction, Request, Response } from 'express'
import type { SupportStrategyResponseDto } from 'dto'
import { AuditService, SupportStrategyService } from '../../../../services'
import { BaseAuditData } from '../../../../services/auditService'
import { Result } from '../../../../utils/result/result'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

export default class ConfirmController {
  constructor(
    private readonly supportStrategyService: SupportStrategyService,
    private readonly auditService: AuditService,
  ) {}

  getConfirmView = async (req: Request, res: Response, _next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const supportStrategyResponseDto = req.journeyData.supportStrategyDto as SupportStrategyResponseDto

    const viewRenderArgs = {
      prisonerSummary,
      mode: 'active',
      dto: supportStrategyResponseDto,
      errorDeletingSupportStrategy: req.flash('pageHasApiErrors')[0] != null,
    }

    return res.render('pages/support-strategies/delete/confirm/index', viewRenderArgs)
  }

  submitConfirmForm = async (req: Request, res: Response, _next: NextFunction) => {
    const { activeCaseLoadId, username } = res.locals.user as PrisonUser
    const dto = req.journeyData.supportStrategyDto as SupportStrategyResponseDto
    const { reference, prisonNumber, deleteReason } = dto

    const { apiErrorCallback } = res.locals
    const result = await Result.wrap(
      this.supportStrategyService.deleteSupportStrategy(
        username,
        prisonNumber,
        reference,
        activeCaseLoadId,
        deleteReason,
      ),
      apiErrorCallback,
    )
    if (!result.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('confirm')
    }

    req.journeyData.supportStrategyDto = undefined
    this.auditService.logDeleteSupportStrategy(this.deleteSupportStrategyAuditData(req, dto))
    return res.redirectWithSuccess(
      `/profile/${prisonNumber}/support-strategies#current-support-strategies`,
      'Support strategy deleted.',
    )
  }

  private deleteSupportStrategyAuditData = (req: Request, dto: SupportStrategyResponseDto): BaseAuditData => {
    return {
      details: {
        supportStrategyReference: dto.reference,
        mode: 'active',
      },
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}
