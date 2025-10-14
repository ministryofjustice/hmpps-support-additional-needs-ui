import { Request, Response } from 'express'
import LearningNeedsSupportPractitionerSupportController from './learningNeedsSupportPractitionerSupportController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import YesNoValue from '../../../../enums/yesNoValue'
import aValidReviewEducationSupportPlanDto from '../../../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'

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
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        lnspSupportNeeded: undefined,
        lnspSupport: undefined,
        lnspSupportHours: undefined,
      },
    }
  })

  it('should render view given no previously submitted invalid form and review DTO does not have an answer', async () => {
    // Given
    res.locals.invalidForm = undefined

    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        lnspSupportNeeded: true,
        lnspSupport: 'Will need to read all text to Chris',
        lnspSupportHours: 15,
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        lnspSupportNeeded: undefined,
        lnspSupport: undefined,
        lnspSupportHours: undefined,
      },
    }

    const expectedViewTemplate = 'pages/education-support-plan/learning-needs-support-practitioner-support/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        supportRequired: YesNoValue.YES,
        details: 'Will need to read all text to Chris',
        supportHours: 15,
      },
      mode: 'review',
      currentAnswer: 'Will need to read all text to Chris',
      currentSupportHours: 15,
    }

    // When
    await controller.getLnspSupportView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given no previously submitted invalid form and review DTO already has an answer', async () => {
    // Given
    res.locals.invalidForm = undefined

    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        lnspSupportNeeded: true,
        lnspSupport: 'Will need to read all text to Chris',
        lnspSupportHours: 15,
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        lnspSupportNeeded: true,
        lnspSupport: 'Will need to read and explain text to Chris',
        lnspSupportHours: 20,
      },
    }

    const expectedViewTemplate = 'pages/education-support-plan/learning-needs-support-practitioner-support/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        supportRequired: YesNoValue.YES,
        details: 'Will need to read and explain text to Chris',
        supportHours: 20,
      },
      mode: 'review',
      currentAnswer: 'Will need to read all text to Chris',
      currentSupportHours: 15,
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
    const expectedViewModel = {
      prisonerSummary,
      form: invalidForm,
      mode: 'review',
      currentAnswer: 'Will need to read all text to Chris',
      currentSupportHours: 15,
    }

    // When
    await controller.getLnspSupportView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given previous page was not check your answers', async () => {
    // Given
    req.query = {}
    req.journeyData = {
      educationSupportPlanDto: aValidEducationSupportPlanDto(),
      reviewEducationSupportPlanDto: aValidReviewEducationSupportPlanDto(),
    }
    req.body = {
      supportRequired: YesNoValue.YES,
      details: 'Will need to read all text to Chris',
      supportHours: '25', // the form submission will be a string
    }

    const expectedNextRoute = 'additional-information'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      lnspSupportNeeded: true,
      lnspSupport: 'Will need to read all text to Chris',
      lnspSupportHours: 25, // the value mapped to the DTO is expected to be a Number
    }

    // When
    await controller.submitLnspSupportForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })

  it('should submit form and redirect to next route given previous page was check your answers', async () => {
    // Given
    req.query = { submitToCheckAnswers: 'true' }
    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        lnspSupportNeeded: false,
        lnspSupport: undefined,
        lnspSupportHours: undefined,
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        lnspSupportNeeded: false,
        lnspSupport: undefined,
        lnspSupportHours: undefined,
      },
    }
    req.body = {
      supportRequired: YesNoValue.YES,
      details: 'Will need to read all text to Chris',
      supportHours: '10',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      lnspSupportNeeded: true,
      lnspSupport: 'Will need to read all text to Chris',
      lnspSupportHours: 10,
    }

    // When
    await controller.submitLnspSupportForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })
})
