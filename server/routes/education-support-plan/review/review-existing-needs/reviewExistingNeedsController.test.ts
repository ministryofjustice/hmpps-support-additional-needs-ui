import { Request, Response } from 'express'
import ReviewExistingNeedsController from './reviewExistingNeedsController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidReviewEducationSupportPlanDto from '../../../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'
import YesNoValue from '../../../../enums/yesNoValue'

describe('reviewExistingNeedsController', () => {
  const controller = new ReviewExistingNeedsController()

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
        reviewExistingNeeds: true,
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/review-existing-needs/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        reviewExistingNeeds: YesNoValue.YES,
      },
      mode: 'review',
    }

    // When
    await controller.getReviewExistingNeedsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      reviewExistingNeeds: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/review-existing-needs/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm, mode: 'review' }

    // When
    await controller.getReviewExistingNeedsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given answer was yes', async () => {
    // Given
    req.journeyData = { reviewEducationSupportPlanDto: aValidReviewEducationSupportPlanDto() }
    req.body = {
      reviewExistingNeeds: YesNoValue.YES,
    }

    const expectedNextRoute = 'who-reviewed-the-plan'
    const expectedEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      reviewExistingNeeds: true,
    }

    // When
    await controller.submitReviewExistingNeedsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })

  it('should submit form and redirect to next route given answer was no', async () => {
    // Given
    req.journeyData = { reviewEducationSupportPlanDto: aValidReviewEducationSupportPlanDto() }
    req.body = {
      reviewExistingNeeds: YesNoValue.NO,
    }

    const expectedNextRoute = 'who-reviewed-the-plan'
    const expectedEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      reviewExistingNeeds: false,
    }

    // When
    await controller.submitReviewExistingNeedsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
  })
})
