import { Request, Response } from 'express'
import AddPersonConsultedController from './addPersonConsultedController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidReviewEducationSupportPlanDto from '../../../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'

describe('addPersonConsultedController', () => {
  const controller = new AddPersonConsultedController()

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
    req.journeyData = {
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        wereOtherPeopleConsulted: true,
        otherPeopleConsulted: [{ name: 'A Teacher', jobRole: 'Education Instructor' }],
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/other-people-consulted/add-person-consulted/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {},
      mode: 'review',
    }

    // When
    await controller.getAddPersonConsultedView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      fullName: undefined as string,
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/other-people-consulted/add-person-consulted/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm, mode: 'review' }

    // When
    await controller.getAddPersonConsultedView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given no people defined on the DTO yet', async () => {
    // Given
    req.query = {}
    req.journeyData = {
      reviewEducationSupportPlanDto: aValidReviewEducationSupportPlanDto({ otherPeopleConsulted: null }),
    }
    req.body = {
      fullName: 'A Teacher',
      jobRole: 'A test job role',
    }

    const expectedNextRoute = 'list'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      otherPeopleConsulted: [{ name: 'A Teacher', jobRole: 'A test job role' }],
    }

    // When
    await controller.submitAddPersonConsultedForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })

  it('should submit form and redirect to next route given some people already defined on the DTO', async () => {
    // Given
    req.query = {}
    req.journeyData = {
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        otherPeopleConsulted: [
          { name: 'Person 1', jobRole: 'A test job role' },
          { name: 'Person 2', jobRole: 'A test job role' },
        ],
      },
    }
    req.body = {
      fullName: 'Person 3',
      jobRole: 'A test job role',
    }

    const expectedNextRoute = 'list'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      otherPeopleConsulted: [
        { name: 'Person 1', jobRole: 'A test job role' },
        { name: 'Person 2', jobRole: 'A test job role' },
        { name: 'Person 3', jobRole: 'A test job role' },
      ],
    }

    // When
    await controller.submitAddPersonConsultedForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })

  it('should submit form and redirect to next route given the check your answers flag was passed on the query string', async () => {
    // Given
    req.query = { submitToCheckAnswers: 'true' }
    req.journeyData = {
      reviewEducationSupportPlanDto: aValidReviewEducationSupportPlanDto({ otherPeopleConsulted: null }),
    }
    req.body = {
      fullName: 'A Teacher',
      jobRole: 'A test job role',
    }

    const expectedNextRoute = 'list?submitToCheckAnswers=true' // expect the submitToCheckAnswers flag to be passed to the next route
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      otherPeopleConsulted: [{ name: 'A Teacher', jobRole: 'A test job role' }],
    }

    // When
    await controller.submitAddPersonConsultedForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })
})
