import { NextFunction, Request, Response } from 'express'
import type { SupportStrategyResponseDto } from 'dto'
import { AuditService, SupportStrategyService } from '../../../../services'
import { BaseAuditData } from '../../../../services/auditService'
import { Result } from '../../../../utils/result/result'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

export default class ReasonController {
  constructor(
    private readonly supportStrategyService: SupportStrategyService,
    private readonly auditService: AuditService,
  ) {}

  getReasonView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm, prisonerSummary, prisonNamesById } = res.locals
    const supportStrategyDto = req.journeyData.supportStrategyDto as SupportStrategyResponseDto

    const reasonForm = invalidForm ?? { archiveReason: '' }

    const viewRenderArgs = {
      prisonerSummary,
      prisonNamesById,
      mode: 'archive',
      dto: supportStrategyDto,
      form: reasonForm,
      errorRecordingSupportStrategy: req.flash('pageHasApiErrors')[0] != null,
    }

    return res.render('pages/support-strategies/reason/archive-journey/index', viewRenderArgs)
  }

  submitReasonForm = async (req: Request, res: Response, next: NextFunction) => {
    const reasonForm = { ...req.body }
    this.updateDtoFromForm(req, reasonForm)

    const { activeCaseLoadId, username } = res.locals.user as PrisonUser

    const supportStrategyResponseDto = req.journeyData.supportStrategyDto as SupportStrategyResponseDto
    const { reference } = supportStrategyResponseDto
    const supportStrategyDto = { ...supportStrategyResponseDto, prisonId: activeCaseLoadId }

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.supportStrategyService.archiveSupportStrategy(username, reference, supportStrategyDto),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('reason')
    }

    const { prisonNumber } = supportStrategyDto
    req.journeyData.supportStrategyDto = undefined
    this.auditService.logArchiveSupportStrategy(this.archiveSupportStrategyAuditData(req, supportStrategyDto)) // no need to wait for response
    return res.redirectWithSuccess(
      `/profile/${prisonNumber}/support-strategies#archived-support-strategies`,
      'Support strategy moved to History',
    )
  }

  private updateDtoFromForm = (req: Request, form: { archiveReason: string }) => {
    const { supportStrategyDto } = req.journeyData
    supportStrategyDto.archiveReason = form.archiveReason
    req.journeyData.supportStrategyDto = supportStrategyDto
  }

  private archiveSupportStrategyAuditData = (
    req: Request,
    supportStrategyDto: SupportStrategyResponseDto,
  ): BaseAuditData => {
    return {
      details: {
        supportStrategyReference: supportStrategyDto.reference,
      },
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}
