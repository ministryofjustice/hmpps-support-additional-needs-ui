import { Request, Response } from 'express'
import AddPersonConsultedController from './addPersonConsultedController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'

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
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
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
    const expectedViewModel = { prisonerSummary, form: invalidForm }

    // When
    await controller.getAddPersonConsultedView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given no people defined on the DTO yet', async () => {
    // Given
    req.query = {}
    req.journeyData = { educationSupportPlanDto: aValidEducationSupportPlanDto() }
    req.body = {
      fullName: 'A Teacher',
    }

    const expectedNextRoute = 'list'
    const expectedEducationSupportPlanDto = {
      ...aValidEducationSupportPlanDto(),
      otherPeopleConsulted: [{ name: 'A Teacher', jobRole: 'N/A' }],
    }

    // When
    await controller.submitAddPersonConsultedForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })

  it('should submit form and redirect to next route given some people already defined on the DTO', async () => {
    // Given
    req.query = {}
    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        otherPeopleConsulted: [
          { name: 'Person 1', jobRole: 'N/A' },
          { name: 'Person 2', jobRole: 'N/A' },
        ],
      },
    }
    req.body = {
      fullName: 'Person 3',
    }

    const expectedNextRoute = 'list'
    const expectedEducationSupportPlanDto = {
      ...aValidEducationSupportPlanDto(),
      otherPeopleConsulted: [
        { name: 'Person 1', jobRole: 'N/A' },
        { name: 'Person 2', jobRole: 'N/A' },
        { name: 'Person 3', jobRole: 'N/A' },
      ],
    }

    // When
    await controller.submitAddPersonConsultedForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })
})
