import { Request, Response } from 'express'
import LearningNeedsSupportPractitionerSupportController from './learningNeedsSupportPractitionerSupportController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import YesNoValue from '../../../../enums/yesNoValue'

describe('learningNeedsSupportPractitionerSupportController', () => {
  const controller = new LearningNeedsSupportPractitionerSupportController()

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
        lnspSupportNeeded: true,
        lnspSupport: 'Will need to read all text to Chris',
        lnspSupportHours: 15,
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/learning-needs-support-practitioner-support/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        supportRequired: YesNoValue.YES,
        details: 'Will need to read all text to Chris',
        supportHours: 15,
      },
    }

    // When
    await controller.getLnspSupportView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      supportRequired: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/learning-needs-support-practitioner-support/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm }

    // When
    await controller.getLnspSupportView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given previous page was not check your answers', async () => {
    // Given
    req.query = {}
    req.journeyData = { educationSupportPlanDto: aValidEducationSupportPlanDto() }
    req.body = {
      supportRequired: YesNoValue.YES,
      details: 'Will need to read all text to Chris',
      supportHours: '25', // the form submission will be a string
    }

    const expectedNextRoute = 'additional-information'
    const expectedEducationSupportPlanDto = {
      ...aValidEducationSupportPlanDto(),
      lnspSupportNeeded: true,
      lnspSupport: 'Will need to read all text to Chris',
      lnspSupportHours: 25, // the value mapped to the DTO is expected to be a Number
    }

    // When
    await controller.submitLnspSupportForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })

  it('should submit form and redirect to next route given previous page was check your answers', async () => {
    // Given
    req.query = { submitToCheckAnswers: 'true' }
    req.journeyData = {
      educationSupportPlanDto: { ...aValidEducationSupportPlanDto(), lnspSupportNeeded: false, lnspSupport: undefined },
    }
    req.body = {
      supportRequired: YesNoValue.YES,
      details: 'Will need to read all text to Chris',
      supportHours: '10',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedEducationSupportPlanDto = {
      ...aValidEducationSupportPlanDto(),
      lnspSupportNeeded: true,
      lnspSupport: 'Will need to read all text to Chris',
      lnspSupportHours: 10,
    }

    // When
    await controller.submitLnspSupportForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })
})
