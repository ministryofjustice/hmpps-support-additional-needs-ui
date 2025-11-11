import { NextFunction, Request, Response } from 'express'
import type { StrengthResponseDto } from 'dto'
import { AuditService, StrengthService } from '../../../../services'
import { BaseAuditData } from '../../../../services/auditService'
import { Result } from '../../../../utils/result/result'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

export default class ReasonController {
  constructor(
    private readonly strengthService: StrengthService,
    private readonly auditService: AuditService,
  ) {}

  getReasonView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm, prisonerSummary, prisonNamesById } = res.locals
    const strengthResponseDto = req.journeyData.strengthDto as StrengthResponseDto

    const reasonForm = invalidForm ?? { archiveReason: '' }

    const viewRenderArgs = {
      prisonerSummary,
      prisonNamesById,
      mode: 'archive',
      dto: strengthResponseDto,
      form: reasonForm,
      errorRecordingStrength: req.flash('pageHasApiErrors')[0] != null,
    }

    return res.render('pages/strengths/reason/archive-journey/index', viewRenderArgs)
  }

  submitReasonForm = async (req: Request, res: Response, next: NextFunction) => {
    const reasonForm = { ...req.body }
    this.updateDtoFromForm(req, reasonForm)

    const { activeCaseLoadId, username } = res.locals.user as PrisonUser

    const strengthResponseDto = req.journeyData.strengthDto as StrengthResponseDto
    const { reference } = strengthResponseDto
    const strengthDto = { ...strengthResponseDto, prisonId: activeCaseLoadId }

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.strengthService.archiveStrength(username, reference, strengthDto),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('reason')
    }

    const { prisonNumber } = strengthResponseDto
    req.journeyData.strengthDto = undefined
    this.auditService.logArchiveStrength(this.archiveStrengthAuditData(req, strengthResponseDto)) // no need to wait for response
    return res.redirectWithSuccess(`/profile/${prisonNumber}/strengths#archived-strengths`, 'Strength moved to History')
  }

  private updateDtoFromForm = (req: Request, form: { archiveReason: string }) => {
    const { strengthDto } = req.journeyData
    strengthDto.archiveReason = form.archiveReason
    req.journeyData.strengthDto = strengthDto
  }

  private archiveStrengthAuditData = (req: Request, strengthDto: StrengthResponseDto): BaseAuditData => {
    return {
      details: {
        strengthReference: strengthDto.reference,
      },
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}
