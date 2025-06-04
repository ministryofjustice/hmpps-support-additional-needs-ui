import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import WhoCreatedThePlanController from './whoCreatedThePlanController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('whoCreatedThePlanController', () => {
  const controller = new WhoCreatedThePlanController()

  const journeyId = uuidV4()
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber, journeyId },
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

    const expectedViewTemplate = 'pages/education-support-plan/who-created-the-plan/index'
    const expectedViewModel = { prisonerSummary }

    // When
    await controller.getWhoCreatedThePlanView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      completedBy: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/who-created-the-plan/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm }

    // When
    await controller.getWhoCreatedThePlanView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    const expectedNextRoute = 'other-people-consulted'

    // When
    await controller.submitWhoCreatedThePlanForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
  })
})
