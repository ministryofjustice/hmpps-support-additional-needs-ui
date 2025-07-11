import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import IndividualSupportRequirementsController from './individualSupportRequirementsController'

describe('individualSupportRequirementsController', () => {
  const controller = new IndividualSupportRequirementsController()

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
        individualSupport: 'Chris has asked that he is not sat with disruptive people as he is keen to learn',
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/individual-support-requirements/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        supportRequirements: 'Chris has asked that he is not sat with disruptive people as he is keen to learn',
      },
    }

    // When
    await controller.getIndividualSupportRequirementsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      supportRequirements: 'value too long! '.repeat(15),
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/individual-support-requirements/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm }

    // When
    await controller.getIndividualSupportRequirementsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given previous page was not check your answers', async () => {
    // Given
    req.query = {}
    req.journeyData = { educationSupportPlanDto: aValidEducationSupportPlanDto() }
    req.body = {
      supportRequirements: 'Chris has asked for braille books',
    }

    const expectedNextRoute = 'teaching-adjustments'
    const expectedEducationSupportPlanDto = {
      ...aValidEducationSupportPlanDto(),
      individualSupport: 'Chris has asked for braille books',
    }

    // When
    await controller.submitIndividualSupportRequirementsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })

  it('should submit form and redirect to next route given previous page was check your answers', async () => {
    // Given
    req.query = { submitToCheckAnswers: 'true' }
    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        individualSupport: 'Chris has asked that he is not sat with disruptive people as he is keen to learn',
      },
    }
    req.body = {
      supportRequirements: 'Chris has asked for braille books',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedEducationSupportPlanDto = {
      ...aValidEducationSupportPlanDto(),
      individualSupport: 'Chris has asked for braille books',
    }

    // When
    await controller.submitIndividualSupportRequirementsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })
})
