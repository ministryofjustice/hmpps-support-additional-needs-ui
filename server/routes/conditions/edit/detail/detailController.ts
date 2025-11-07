import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ConditionDto } from 'dto'
import { ConditionService } from '../../../../services'
import { Result } from '../../../../utils/result/result'
import AuditService, { BaseAuditData } from '../../../../services/auditService'
import conditionsThatRequireNaming from '../../conditionsThatRequireNaming'
import ConditionSource from '../../../../enums/conditionSource'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

export default class DetailController {
  constructor(
    private readonly conditionService: ConditionService,
    private readonly auditService: AuditService,
  ) {}

  getDetailView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm, prisonerSummary } = res.locals
    const { conditionDto } = req.journeyData

    const detailForm = invalidForm ?? this.populateFormFromDto(conditionDto)

    const viewRenderArgs = {
      prisonerSummary,
      form: detailForm,
      dto: conditionDto,
      conditionsThatRequireNaming,
      mode: 'edit',
      errorRecordingConditions: req.flash('pageHasApiErrors')[0] != null,
    }
    return res.render('pages/conditions/details/edit-journey/index', viewRenderArgs)
  }

  submitDetailForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const detailForm = { ...req.body }
    this.updateDtoFromForm(req, detailForm)

    const { activeCaseLoadId, username } = res.locals.user as PrisonUser

    const { conditionDto } = req.journeyData
    const { reference } = conditionDto
    const conditionDtoToUpdate = { ...conditionDto, prisonId: activeCaseLoadId }

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.conditionService.updateCondition(username, reference, conditionDtoToUpdate),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('detail')
    }

    const { prisonNumber } = conditionDto
    req.journeyData.conditionDto = undefined
    this.auditService.logEditCondition(this.editConditionAuditData(req, conditionDto)) // no need to wait for response
    return res.redirectWithSuccess(`/profile/${prisonNumber}/conditions`, 'Condition updated')
  }

  private populateFormFromDto = (dto: ConditionDto) => {
    return {
      conditionName: dto.conditionName,
      conditionSource: dto.source,
      conditionDetails: dto.conditionDetails,
    }
  }

  private updateDtoFromForm = (
    req: Request,
    form: { conditionName?: string; conditionSource: ConditionSource; conditionDetails: string },
  ) => {
    const { conditionDto } = req.journeyData
    conditionDto.conditionName = form.conditionName
    conditionDto.source = form.conditionSource
    conditionDto.conditionDetails = form.conditionDetails
    req.journeyData.conditionDto = conditionDto
  }

  private editConditionAuditData = (req: Request, conditionDto: ConditionDto): BaseAuditData => {
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
