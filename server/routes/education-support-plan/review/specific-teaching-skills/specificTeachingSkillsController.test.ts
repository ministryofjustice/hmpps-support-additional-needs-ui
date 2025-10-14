import { Request, Response } from 'express'
import SpecificTeachingSkillsController from './specificTeachingSkillsController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import YesNoValue from '../../../../enums/yesNoValue'
import aValidReviewEducationSupportPlanDto from '../../../../testsupport/reviewEducationSupportPlanDtoTestDataBuilder'

describe('teachingAdjustmentsController', () => {
  const controller = new SpecificTeachingSkillsController()

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
        specificTeachingSkillsNeeded: true,
        specificTeachingSkills: 'Will need to use BSL',
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        specificTeachingSkillsNeeded: undefined,
        specificTeachingSkills: undefined,
      },
    }
  })

  it('should render view given no previously submitted invalid form and review DTO does not have an answer', async () => {
    // Given
    res.locals.invalidForm = undefined

    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        specificTeachingSkillsNeeded: true,
        specificTeachingSkills: 'Will need to use BSL',
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        specificTeachingSkillsNeeded: undefined,
        specificTeachingSkills: undefined,
      },
    }

    const expectedViewTemplate = 'pages/education-support-plan/specific-teaching-skills/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        skillsRequired: YesNoValue.YES,
        details: 'Will need to use BSL',
      },
      mode: 'review',
      currentAnswer: 'Will need to use BSL',
    }

    // When
    await controller.getSpecificTeachingSkillsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given no previously submitted invalid form and review DTO already has an answer', async () => {
    // Given
    res.locals.invalidForm = undefined

    req.journeyData = {
      educationSupportPlanDto: {
        ...aValidEducationSupportPlanDto(),
        specificTeachingSkillsNeeded: true,
        specificTeachingSkills: 'Will need to use BSL',
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        specificTeachingSkillsNeeded: false,
        specificTeachingSkills: undefined,
      },
    }

    const expectedViewTemplate = 'pages/education-support-plan/specific-teaching-skills/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        skillsRequired: YesNoValue.NO,
        details: undefined as string,
      },
      mode: 'review',
      currentAnswer: 'Will need to use BSL',
    }

    // When
    await controller.getSpecificTeachingSkillsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form and review DTO already has an answer', async () => {
    // Given
    const invalidForm = {
      skillsRequired: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/specific-teaching-skills/index'
    const expectedViewModel = {
      prisonerSummary,
      form: invalidForm,
      mode: 'review',
      currentAnswer: 'Will need to use BSL',
    }

    // When
    await controller.getSpecificTeachingSkillsView(req, res, next)

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
      skillsRequired: YesNoValue.YES,
      details: 'Will need to use BSL',
    }

    const expectedNextRoute = 'exam-arrangements'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      specificTeachingSkillsNeeded: true,
      specificTeachingSkills: 'Will need to use BSL',
    }

    // When
    await controller.submitSpecificTeachingSkillsForm(req, res, next)

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
        specificTeachingSkillsNeeded: true,
        specificTeachingSkills: 'Will need to use BSL',
      },
      reviewEducationSupportPlanDto: {
        ...aValidReviewEducationSupportPlanDto(),
        specificTeachingSkillsNeeded: undefined,
        specificTeachingSkills: undefined,
      },
    }
    req.body = {
      skillsRequired: YesNoValue.YES,
      details: 'Will need to use BSL',
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedReviewEducationSupportPlanDto = {
      ...aValidReviewEducationSupportPlanDto(),
      specificTeachingSkillsNeeded: true,
      specificTeachingSkills: 'Will need to use BSL',
    }

    // When
    await controller.submitSpecificTeachingSkillsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.reviewEducationSupportPlanDto).toEqual(expectedReviewEducationSupportPlanDto)
  })
})
