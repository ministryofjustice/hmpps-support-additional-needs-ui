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

  describe('previous page was not check your answers', () => {
    it('should submit form and redirect to next route given Continue button was pressed and previous page was not check your answers', async () => {
      // Given
      req.query = {}
      req.body = {}
      req.journeyData = { educationSupportPlanDto }

      const expectedNextRoute = '../review-existing-needs'

      // When
      await controller.submitOtherPeopleConsultedListForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    })

    it('should submit form and redirect to next route given Add Person button was pressed and previous page was not check your answers', async () => {
      // Given
      req.query = {}
      req.body = { addPerson: '' }
      req.journeyData = { educationSupportPlanDto }

      const expectedNextRoute = 'add-person'

      // When
      await controller.submitOtherPeopleConsultedListForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    })

    it('should submit form and redirect to next route given Remove button was pressed and there are 1 or more people left on the DTO and previous page was not check your answers', async () => {
      // Given
      req.query = {}
      req.journeyData = {
        educationSupportPlanDto: {
          ...educationSupportPlanDto,
          otherPeopleConsulted: [
            { name: 'Person 1', jobRole: 'N/A' },
            { name: 'Person 2', jobRole: 'N/A' },
          ],
        },
      }
      req.body = { removePerson: '0' } // remove Person 1 (zero indexed), expect just Person 2 to be left

      const expectedNextRoute = 'list'

      // When
      await controller.submitOtherPeopleConsultedListForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
      expect(req.journeyData.educationSupportPlanDto.otherPeopleConsulted).toEqual([
        {
          name: 'Person 2',
          jobRole: 'N/A',
        },
      ])
    })

    it('should submit form and redirect to next route given Remove button was pressed and there are 0 people left on the DTO and previous page was not check your answers', async () => {
      // Given
      req.query = {}
      req.journeyData = {
        educationSupportPlanDto: {
          ...educationSupportPlanDto,
          otherPeopleConsulted: [{ name: 'Person 1', jobRole: 'N/A' }],
        },
      }
      req.body = { removePerson: '0' } // remove Person 1 (zero indexed)

      const expectedNextRoute = '../other-people-consulted'

      // When
      await controller.submitOtherPeopleConsultedListForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
      expect(req.journeyData.educationSupportPlanDto.otherPeopleConsulted).toEqual([])
    })
  })

  describe('previous page was check your answers', () => {
    it('should submit form and redirect to next route given Continue button was pressed and previous page was check your answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }
      req.body = {}
      req.journeyData = { educationSupportPlanDto }

      const expectedNextRoute = '../check-your-answers'

      // When
      await controller.submitOtherPeopleConsultedListForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    })

    it('should submit form and redirect to next route given Add Person button was pressed and previous page was check your answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }
      req.body = { addPerson: '' }
      req.journeyData = { educationSupportPlanDto }

      const expectedNextRoute = 'add-person?submitToCheckAnswers=true' // expect the submitToCheckAnswers flag to be passed to the next route

      // When
      await controller.submitOtherPeopleConsultedListForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    })

    it('should submit form and redirect to next route given Remove button was pressed and there are 1 or more people left on the DTO and previous page was check your answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }
      req.journeyData = {
        educationSupportPlanDto: {
          ...educationSupportPlanDto,
          otherPeopleConsulted: [
            { name: 'Person 1', jobRole: 'N/A' },
            { name: 'Person 2', jobRole: 'N/A' },
          ],
        },
      }
      req.body = { removePerson: '0' } // remove Person 1 (zero indexed), expect just Person 2 to be left

      const expectedNextRoute = 'list?submitToCheckAnswers=true' // expect the submitToCheckAnswers flag to be passed to the next route

      // When
      await controller.submitOtherPeopleConsultedListForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
      expect(req.journeyData.educationSupportPlanDto.otherPeopleConsulted).toEqual([
        {
          name: 'Person 2',
          jobRole: 'N/A',
        },
      ])
    })

    it('should submit form and redirect to next route given Remove button was pressed and there are 0 people left on the DTO and previous page was check your answers', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }
      req.journeyData = {
        educationSupportPlanDto: {
          ...educationSupportPlanDto,
          otherPeopleConsulted: [{ name: 'Person 1', jobRole: 'N/A' }],
        },
      }
      req.body = { removePerson: '0' } // remove Person 1 (zero indexed)

      const expectedNextRoute = '../other-people-consulted?submitToCheckAnswers=true' // expect the submitToCheckAnswers flag to be passed to the next route

      // When
      await controller.submitOtherPeopleConsultedListForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
      expect(req.journeyData.educationSupportPlanDto.otherPeopleConsulted).toEqual([])
    })
  })
})
