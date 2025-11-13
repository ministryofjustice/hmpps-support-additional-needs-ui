import { NextFunction, Request, Response } from 'express'
import type { ConditionDto } from 'dto'
import { AuditService, ConditionService } from '../../../../services'
import { BaseAuditData } from '../../../../services/auditService'
import { Result } from '../../../../utils/result/result'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

export default class ReasonController {
  constructor(
    private readonly conditionService: ConditionService,
    private readonly auditService: AuditService,
  ) {}

  getReasonView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm, prisonerSummary, prisonNamesById } = res.locals
    const { conditionDto } = req.journeyData

    const reasonForm = invalidForm ?? { archiveReason: '' }

    const viewRenderArgs = {
      prisonerSummary,
      prisonNamesById,
      mode: 'archive',
      dto: conditionDto,
      form: reasonForm,
      errorRecordingCondition: req.flash('pageHasApiErrors')[0] != null,
    }

    return res.render('pages/conditions/reason/archive-journey/index', viewRenderArgs)
  }

  submitReasonForm = async (req: Request, res: Response, next: NextFunction) => {
    const reasonForm = { ...req.body }
    this.updateDtoFromForm(req, reasonForm)

    const { activeCaseLoadId, username } = res.locals.user as PrisonUser

    const conditionDto = { ...req.journeyData.conditionDto, prisonId: activeCaseLoadId }
    const { reference } = conditionDto

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.conditionService.archiveCondition(username, reference, conditionDto),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('reason')
    }

    const { prisonNumber } = conditionDto
    req.journeyData.conditionDto = undefined
    this.auditService.logArchiveCondition(this.archiveConditionAuditData(req, conditionDto)) // no need to wait for response
    return res.redirectWithSuccess(
      `/profile/${prisonNumber}/conditions#archived-conditions`,
      'Condition moved to History',
    )
  }

  private updateDtoFromForm = (req: Request, form: { archiveReason: string }) => {
    const { conditionDto } = req.journeyData
    conditionDto.archiveReason = form.archiveReason
    req.journeyData.conditionDto = conditionDto
  }

  private archiveConditionAuditData = (req: Request, conditionDto: ConditionDto): BaseAuditData => {
    return {
      details: {
        conditionReference: conditionDto.reference,
      },
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}
