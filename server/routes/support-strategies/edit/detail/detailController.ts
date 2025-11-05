import { NextFunction, Request, Response } from 'express'
import type { SupportStrategyResponseDto } from 'dto'
import { SupportStrategyService } from '../../../../services'
import { Result } from '../../../../utils/result/result'
import AuditService, { BaseAuditData } from '../../../../services/auditService'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

export default class DetailController {
  constructor(
    private readonly supportStrategyService: SupportStrategyService,
    private readonly auditService: AuditService,
  ) {}

  getDetailView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const supportStrategyDto = req.journeyData.supportStrategyDto as SupportStrategyResponseDto

    const detailForm = invalidForm ?? this.populateFormFromDto(supportStrategyDto)

    const viewRenderArgs = {
      form: detailForm,
      category: supportStrategyDto.supportStrategyTypeCode,
      mode: 'edit',
      errorRecordingSupportStrategy: req.flash('pageHasApiErrors')[0] != null,
    }
    return res.render('pages/support-strategies/detail/edit-journey/index', viewRenderArgs)
  }

  submitDetailForm = async (req: Request, res: Response, next: NextFunction) => {
    const detailForm = { ...req.body }
    this.updateDtoFromForm(req, detailForm)

    const { activeCaseLoadId, username } = res.locals.user as PrisonUser

    const supportStrategyResponseDto = req.journeyData.supportStrategyDto as SupportStrategyResponseDto
    const { reference } = supportStrategyResponseDto
    const supportStrategyDto = { ...supportStrategyResponseDto, prisonId: activeCaseLoadId }

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.supportStrategyService.updateSupportStrategy(username, reference, supportStrategyDto),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('detail')
    }

    const { prisonNumber } = supportStrategyDto
    req.journeyData.supportStrategyDto = undefined
    this.auditService.logEditSupportStrategy(this.editSupportStrategyAuditData(req, supportStrategyDto)) // no need to wait for response
    return res.redirectWithSuccess(`/profile/${prisonNumber}/support-strategies`, 'Support strategy updated')
  }

  private populateFormFromDto = (dto: SupportStrategyResponseDto) => {
    return {
      description: dto.supportStrategyDetails,
    }
  }

  private updateDtoFromForm = (req: Request, form: { description: string }) => {
    const { supportStrategyDto } = req.journeyData
    supportStrategyDto.supportStrategyDetails = form.description
    req.journeyData.supportStrategyDto = supportStrategyDto
  }

  private editSupportStrategyAuditData = (
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
