import { Request, Response } from 'express'
import ExamArrangementsController from './examArrangementsController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('examArrangementsController', () => {
  const controller = new ExamArrangementsController()

  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/exam-arrangements/index'
    const expectedViewModel = { prisonerSummary }

    // When
    await controller.getExamArrangementsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      adjustmentsNeeded: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/exam-arrangements/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm }

    // When
    await controller.getExamArrangementsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    const expectedNextRoute = 'ehcp'

    // When
    await controller.submitExamArrangementsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
  })
})
