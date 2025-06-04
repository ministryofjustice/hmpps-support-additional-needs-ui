import { Request, Response } from 'express'
import { v4 as uuidV4 } from 'uuid'
import OtherPeopleConsultedController from './otherPeopleConsultedController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('otherPeopleConsultedController', () => {
  const controller = new OtherPeopleConsultedController()

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

  it('should render view', async () => {
    // Given
    const expectedViewTemplate = 'pages/education-support-plan/other-people-consulted/index'
    const expectedViewModel = { prisonerSummary }

    // When
    await controller.getOtherPeopleConsultedView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    const expectedNextRoute = 'review-needs-conditions-and-strengths'

    // When
    await controller.submitOtherPeopleConsultedForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
  })
})
