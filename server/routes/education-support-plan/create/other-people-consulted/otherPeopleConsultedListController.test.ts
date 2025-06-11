import { Request, Response } from 'express'
import OtherPeopleConsultedListController from './otherPeopleConsultedListController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'

describe('otherPeopleConsultedListController', () => {
  const controller = new OtherPeopleConsultedListController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const educationSupportPlanDto = aValidEducationSupportPlanDto({ prisonNumber })

  const req = {
    session: {},
    journeyData: {},
    body: {},
    userClickedOnButton: (buttonName: string) => Object.prototype.hasOwnProperty.call(req.body, buttonName),
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
    req.journeyData = { educationSupportPlanDto }
  })

  it('should render view', async () => {
    // Given
    const expectedViewTemplate = 'pages/education-support-plan/other-people-consulted/people-consulted-list/index'
    const expectedViewModel = {
      prisonerSummary,
      dto: educationSupportPlanDto,
    }

    // When
    await controller.getOtherPeopleConsultedListView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given Continue button was pressed', async () => {
    // Given
    req.body = {}
    req.journeyData = { educationSupportPlanDto }

    const expectedNextRoute = '../review-needs-conditions-and-strengths'

    // When
    await controller.submitOtherPeopleConsultedListForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
  })

  it('should submit form and redirect to next route given Add Person button was pressed', async () => {
    // Given
    req.body = { addPerson: '' }
    req.journeyData = { educationSupportPlanDto }

    const expectedNextRoute = 'add-person'

    // When
    await controller.submitOtherPeopleConsultedListForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
  })
})
