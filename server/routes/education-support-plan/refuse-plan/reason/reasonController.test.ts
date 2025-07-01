import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidRefuseEducationSupportPlanDto from '../../../../testsupport/refuseEducationSupportPlanDtoTestDataBuilder'
import ReasonController from './reasonController'
import PlanCreationScheduleExemptionReason from '../../../../enums/planCreationScheduleExemptionReason'
import EducationSupportPlanService from '../../../../services/educationSupportPlanService'
import aValidPlanCreationScheduleDto from '../../../../testsupport/planCreationScheduleDtoTestDataBuilder'

jest.mock('../../../../services/educationSupportPlanService')

describe('reasonController', () => {
  const educationSupportPlanService = new EducationSupportPlanService(null) as jest.Mocked<EducationSupportPlanService>
  const controller = new ReasonController(educationSupportPlanService)

  const username = 'A_USER'
  const prisonId = 'MDI'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const flash = jest.fn()

  const req = {
    session: {},
    user: { username },
    journeyData: {},
    body: {},
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {
      refuseEducationSupportPlanDto: {
        ...aValidRefuseEducationSupportPlanDto({
          reason: PlanCreationScheduleExemptionReason.EXEMPT_REFUSED_TO_ENGAGE,
          details: 'Chris failed to engage and would not cooperate to setup a plan',
        }),
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/refuse-plan/reason/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        refusalReason: 'EXEMPT_REFUSED_TO_ENGAGE',
        refusalReasonDetails: 'Chris failed to engage and would not cooperate to setup a plan',
      },
      errorRecordingEducationSupportPlanRefusal: false,
    }

    // When
    await controller.getRefusePlanReasonView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    const invalidForm = {
      refusalReason: PlanCreationScheduleExemptionReason.EXEMPT_NOT_REQUIRED,
      refusalReasonDetails: 'a'.repeat(201),
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/refuse-plan/reason/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm, errorRecordingEducationSupportPlanRefusal: false }

    // When
    await controller.getRefusePlanReasonView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given given api errors from previous submission', async () => {
    // Given
    flash.mockReturnValue(['true'])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/refuse-plan/reason/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        refusalReason: 'EXEMPT_REFUSED_TO_ENGAGE',
        refusalReasonDetails: 'Chris failed to engage and would not cooperate to setup a plan',
      },
      errorRecordingEducationSupportPlanRefusal: true,
    }

    // When
    await controller.getRefusePlanReasonView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given calling API is successful', async () => {
    // Given
    const refuseEducationSupportPlanDto = aValidRefuseEducationSupportPlanDto({
      prisonNumber,
      prisonId,
      reason: null,
      details: null,
    })
    req.journeyData = { refuseEducationSupportPlanDto }
    req.body = {
      refusalReason: PlanCreationScheduleExemptionReason.EXEMPT_NOT_REQUIRED,
      refusalReasonDetails: 'Chris does not want a plan',
    }

    educationSupportPlanService.updateEducationSupportPlanCreationScheduleAsRefused.mockResolvedValue(
      aValidPlanCreationScheduleDto({ prisonNumber }),
    )

    const expectedRefuseEducationSupportPlanDto = aValidRefuseEducationSupportPlanDto({
      prisonNumber,
      prisonId,
      reason: PlanCreationScheduleExemptionReason.EXEMPT_NOT_REQUIRED,
      details: 'Chris does not want a plan',
    })
    const expectedNextRoute = `/profile/${prisonNumber}/overview`

    // When
    await controller.submitRefusePlanReasonView(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(
      expectedNextRoute,
      'Refusal of education support plan recorded',
    )
    expect(req.journeyData.refuseEducationSupportPlanDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(educationSupportPlanService.updateEducationSupportPlanCreationScheduleAsRefused).toHaveBeenCalledWith(
      username,
      expectedRefuseEducationSupportPlanDto,
    )
  })

  it('should submit form and redirect to next route given calling API is not successful', async () => {
    // Given
    const refuseEducationSupportPlanDto = aValidRefuseEducationSupportPlanDto({
      prisonNumber,
      prisonId,
      reason: null,
      details: null,
    })
    req.journeyData = { refuseEducationSupportPlanDto }
    req.body = {
      refusalReason: PlanCreationScheduleExemptionReason.EXEMPT_NOT_REQUIRED,
      refusalReasonDetails: 'Chris does not want a plan',
    }

    educationSupportPlanService.updateEducationSupportPlanCreationScheduleAsRefused.mockRejectedValue(
      new Error('Internal Server Error'),
    )

    const expectedRefuseEducationSupportPlanDto = aValidRefuseEducationSupportPlanDto({
      prisonNumber,
      prisonId,
      reason: PlanCreationScheduleExemptionReason.EXEMPT_NOT_REQUIRED,
      details: 'Chris does not want a plan',
    })
    const expectedNextRoute = 'reason'

    // When
    await controller.submitRefusePlanReasonView(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.refuseEducationSupportPlanDto).toEqual(refuseEducationSupportPlanDto)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(educationSupportPlanService.updateEducationSupportPlanCreationScheduleAsRefused).toHaveBeenCalledWith(
      username,
      expectedRefuseEducationSupportPlanDto,
    )
  })
})
