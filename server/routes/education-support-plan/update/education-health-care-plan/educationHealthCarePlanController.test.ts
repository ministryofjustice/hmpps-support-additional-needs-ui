import { Request, Response } from 'express'
import EducationHealthCarePlanController from './educationHealthCarePlanController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import YesNoValue from '../../../../enums/yesNoValue'
import AuditService from '../../../../services/auditService'

jest.mock('../../../../services/auditService')

describe('educationHealthCarePlanController', () => {
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new EducationHealthCarePlanController(auditService)

  const username = 'A_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    user: { username },
    params: { prisonNumber },
    journeyData: {},
    body: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
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

  it('should submit form and redirect Education Support Plan page', async () => {
    // Given
    req.query = {}
    req.journeyData = { educationSupportPlanDto: aValidEducationSupportPlanDto() }
    req.body = {
      hasCurrentEhcp: YesNoValue.YES,
    }

    /*
    const expectedEducationSupportPlanDto = {
      ...aValidEducationSupportPlanDto(),
      hasCurrentEhcp: true,
    }
    */

    // When
    await controller.submitEhcpForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(
      `/profile/${prisonNumber}/education-support-plan`,
      'Education support plan updated',
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
})
