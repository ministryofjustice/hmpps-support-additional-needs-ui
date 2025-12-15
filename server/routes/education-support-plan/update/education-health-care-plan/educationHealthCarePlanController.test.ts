import { Request, Response } from 'express'
import EducationHealthCarePlanController from './educationHealthCarePlanController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import YesNoValue from '../../../../enums/yesNoValue'
import AuditService from '../../../../services/auditService'
import EducationSupportPlanService from '../../../../services/educationSupportPlanService'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/educationSupportPlanService')

describe('educationHealthCarePlanController', () => {
  const educationSupportPlanService = new EducationSupportPlanService(null) as jest.Mocked<EducationSupportPlanService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new EducationHealthCarePlanController(educationSupportPlanService, auditService)

  const username = 'A_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const flash = jest.fn()
  const req = {
    session: {},
    user: { username },
    params: { prisonNumber },
    journeyData: {},
    body: {},
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary, user: { username, activeCaseLoadId: 'BXI' } },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto({ prisonNumber }),
        hasCurrentEhcp: true,
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/education-health-care-plan/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        hasCurrentEhcp: YesNoValue.YES,
      },
      mode: 'edit',
    }

    // When
    await controller.getEhcpView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      hasCurrentEhcp: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/education-health-care-plan/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm, mode: 'edit' }

    // When
    await controller.getEhcpView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given calling API is successful', async () => {
    // Given
    const educationSupportPlanDto = aValidEducationSupportPlanDto({ hasCurrentEhcp: false })
    req.journeyData = { educationSupportPlanDto }
    req.body = {
      hasCurrentEhcp: YesNoValue.YES,
    }

    const expectedEducationSupportPlanDto = {
      ...educationSupportPlanDto,
      hasCurrentEhcp: true,
    }

    const expectedNextRoute = `/profile/${prisonNumber}/education-support-plan`

    // When
    await controller.submitEhcpForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Education support plan updated')
    expect(educationSupportPlanService.updateEhcpStatus).toHaveBeenCalledWith(
      username,
      prisonNumber,
      expectedEducationSupportPlanDto,
    )
    expect(req.journeyData.educationSupportPlanDto).toBeUndefined()
    expect(auditService.logUpdateEducationLearnerSupportPlan).toHaveBeenCalledWith(
      expect.objectContaining({
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        who: username,
      }),
    )
  })

  it('should submit form and redirect to next route given calling API is not successful', async () => {
    // Given
    const educationSupportPlanDto = aValidEducationSupportPlanDto({ hasCurrentEhcp: false })
    req.journeyData = { educationSupportPlanDto }
    req.body = {
      hasCurrentEhcp: YesNoValue.YES,
    }

    educationSupportPlanService.updateEhcpStatus.mockRejectedValue(new Error('Internal Server Error'))

    const expectedEducationSupportPlanDto = {
      ...educationSupportPlanDto,
      hasCurrentEhcp: true,
    }

    const expectedNextRoute = 'education-health-care-plan'

    // When
    await controller.submitEhcpForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(educationSupportPlanService.updateEhcpStatus).toHaveBeenCalledWith(
      username,
      prisonNumber,
      expectedEducationSupportPlanDto,
    )
    expect(auditService.logUpdateEducationLearnerSupportPlan).not.toHaveBeenCalled()
  })
})
