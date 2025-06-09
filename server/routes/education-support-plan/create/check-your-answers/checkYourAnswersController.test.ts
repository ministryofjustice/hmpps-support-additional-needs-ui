import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import CheckYourAnswersController from './checkYourAnswersController'

describe('checkYourAnswersController', () => {
  const controller = new CheckYourAnswersController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const educationSupportPlanDto = aValidEducationSupportPlanDto({ prisonNumber })

  const req = {
    session: {},
    journeyData: {},
    body: {},
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

  it('should render view', async () => {
    // Given
    const expectedViewTemplate = 'pages/education-support-plan/check-your-answers/index'
    const expectedViewModel = {
      prisonerSummary,
      dto: aValidEducationSupportPlanDto(),
    }

    // When
    await controller.getCheckYourAnswersView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    const expectedNextRoute = `/profile/${prisonNumber}/overview`

    // When
    await controller.submitCheckYourAnswersForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Education support plan created')
    expect(req.journeyData.educationSupportPlanDto).toBeUndefined()
  })
})
