import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import CheckYourAnswersController from './checkYourAnswersController'
import EducationSupportPlanService from '../../../../services/educationSupportPlanService'

jest.mock('../../../../services/educationSupportPlanService')

describe('checkYourAnswersController', () => {
  const educationSupportPlanService = new EducationSupportPlanService(null) as jest.Mocked<EducationSupportPlanService>
  const controller = new CheckYourAnswersController(educationSupportPlanService)

  const username = 'A_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const educationSupportPlanDto = aValidEducationSupportPlanDto({ prisonNumber })

  const flash = jest.fn()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    user: { username },
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
      educationSupportPlanDto,
    }
  })

  it('should render view given no api errors from previous submission', async () => {
    // Given
    flash.mockReturnValue([])

    const expectedViewTemplate = 'pages/education-support-plan/check-your-answers/index'
    const expectedViewModel = {
      prisonerSummary,
      dto: aValidEducationSupportPlanDto(),
      errorSavingEducationSupportPlan: false,
    }

    // When
    await controller.getCheckYourAnswersView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given api errors from previous submission', async () => {
    // Given
    flash.mockReturnValue(['true'])

    const expectedViewTemplate = 'pages/education-support-plan/check-your-answers/index'
    const expectedViewModel = {
      prisonerSummary,
      dto: aValidEducationSupportPlanDto(),
      errorSavingEducationSupportPlan: true,
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
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Education support plan created')
    expect(req.journeyData.educationSupportPlanDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(educationSupportPlanService.createEducationSupportPlan).toHaveBeenCalledWith(
      username,
      educationSupportPlanDto,
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
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(educationSupportPlanService.createEducationSupportPlan).toHaveBeenCalledWith(
      username,
      educationSupportPlanDto,
    )
  })
})
