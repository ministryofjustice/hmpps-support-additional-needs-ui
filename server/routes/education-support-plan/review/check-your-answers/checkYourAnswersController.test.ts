import { Request, Response } from 'express'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import CheckYourAnswersController from './checkYourAnswersController'
import EducationSupportPlanService from '../../../../services/educationSupportPlanService'
import AuditService from '../../../../services/auditService'
import aValidReviewEducationSupportPlanDto from '../../../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/educationSupportPlanService')

describe('checkYourAnswersController', () => {
  const educationSupportPlanService = new EducationSupportPlanService(null) as jest.Mocked<EducationSupportPlanService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new CheckYourAnswersController(educationSupportPlanService, auditService)

  const username = 'A_USER'
  const prisonNumber = 'A1234BC'
  const educationSupportPlanDto = aValidEducationSupportPlanDto({ prisonNumber })
  const reviewEducationSupportPlanDto = aValidReviewEducationSupportPlanDto({ prisonNumber })

  const flash = jest.fn()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    user: { username },
    params: { prisonNumber },
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {
      educationSupportPlanDto,
      reviewEducationSupportPlanDto,
    }
  })

  it('should render view given no api errors from previous submission', async () => {
    // Given
    flash.mockReturnValue([])

    const expectedViewTemplate = 'pages/education-support-plan/check-your-answers/review-journey/index'
    const expectedViewModel = {
      dto: reviewEducationSupportPlanDto,
      errorSavingEducationSupportPlan: false,
      mode: 'review',
    }

    // When
    await controller.getCheckYourAnswersView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given api errors from previous submission', async () => {
    // Given
    flash.mockReturnValue(['true'])

    const expectedViewTemplate = 'pages/education-support-plan/check-your-answers/review-journey/index'
    const expectedViewModel = {
      dto: reviewEducationSupportPlanDto,
      errorSavingEducationSupportPlan: true,
      mode: 'review',
    }

    // When
    await controller.getCheckYourAnswersView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given calling API is successful', async () => {
    // Given
    educationSupportPlanService.createEducationSupportPlan.mockResolvedValue(
      aValidEducationSupportPlanDto({ prisonNumber }),
    )

    const expectedNextRoute = `/profile/${prisonNumber}/overview`

    // When
    await controller.submitCheckYourAnswersForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Review of education support plan recorded')
    expect(req.journeyData.educationSupportPlanDto).toBeUndefined()
    expect(req.journeyData.reviewEducationSupportPlanDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(educationSupportPlanService.createEducationSupportPlan).toHaveBeenCalledWith(
      username,
      educationSupportPlanDto,
    )
    expect(auditService.logReviewEducationLearnerSupportPlan).toHaveBeenCalledWith(
      expect.objectContaining({
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        who: username,
      }),
    )
  })

  it('should submit form and redirect to next route given calling API is not successful', async () => {
    // Given
    educationSupportPlanService.createEducationSupportPlan.mockRejectedValue(new Error('Internal Server Error'))

    const expectedNextRoute = 'check-your-answers'

    // When
    await controller.submitCheckYourAnswersForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.educationSupportPlanDto).toEqual(educationSupportPlanDto)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(reviewEducationSupportPlanDto)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(educationSupportPlanService.createEducationSupportPlan).toHaveBeenCalledWith(
      username,
      educationSupportPlanDto,
    )
    expect(auditService.logReviewEducationLearnerSupportPlan).not.toHaveBeenCalled()
  })
})
