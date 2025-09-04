import { Request, Response } from 'express'
import OtherPeopleConsultedController from './otherPeopleConsultedController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import YesNoValue from '../../../../enums/yesNoValue'

describe('otherPeopleConsultedController', () => {
  const controller = new OtherPeopleConsultedController()

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
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/other-people-consulted/index'
    const expectedViewModel = {
      prisonerSummary,
      form: {
        wereOtherPeopleConsulted: YesNoValue.YES,
      },
    }

    // When
    await controller.getOtherPeopleConsultedView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      wereOtherPeopleConsulted: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/other-people-consulted/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm }

    // When
    await controller.getOtherPeopleConsultedView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  describe('previous page was not check your answers', () => {
    it('should submit form and redirect to next route given user answers Yes and previous page was not check your answers', async () => {
      // Given
      req.query = {}
      req.journeyData = { educationSupportPlanDto: aValidEducationSupportPlanDto() }
      req.body = {
        wereOtherPeopleConsulted: YesNoValue.YES,
      }

      const expectedNextRoute = 'other-people-consulted/add-person'
      const expectedEducationSupportPlanDto = {
        ...aValidEducationSupportPlanDto(),
        wereOtherPeopleConsulted: true,
      }

      // When
      await controller.submitOtherPeopleConsultedForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
      expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
    })

    it('should submit form and redirect to next route given user answers No and previous page was not check your answers', async () => {
      // Given
      req.query = {}
      req.journeyData = { educationSupportPlanDto: aValidEducationSupportPlanDto({ otherPeopleConsulted: null }) }
      req.body = {
        wereOtherPeopleConsulted: YesNoValue.NO,
      }

      const expectedNextRoute = 'review-existing-needs'
      const expectedEducationSupportPlanDto = {
        ...aValidEducationSupportPlanDto(),
        wereOtherPeopleConsulted: false,
        otherPeopleConsulted: undefined as Array<{ name: string; jobRole: string }>,
      }

      // When
      await controller.submitOtherPeopleConsultedForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
      expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
    })
  })

  describe('previous page was check your answers', () => {
    it('should submit form and redirect to next route given previous page was check your answers and user is changing the answer from Yes to No', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }
      req.journeyData = {
        educationSupportPlanDto: {
          ...aValidEducationSupportPlanDto(),
          wereOtherPeopleConsulted: true,
          otherPeopleConsulted: [{ name: 'A Teacher', jobRole: 'Education Instructor' }],
        },
      }
      req.body = {
        wereOtherPeopleConsulted: YesNoValue.NO,
      }

      const expectedNextRoute = 'check-your-answers' // expect Check Your Answers as the next page because the user has changed from Yes to No and so we do not need to collect additional information
      const expectedEducationSupportPlanDto = {
        ...aValidEducationSupportPlanDto(),
        wereOtherPeopleConsulted: false,
        otherPeopleConsulted: undefined as Array<{ name: string; jobRole: string }>,
      }

      // When
      await controller.submitOtherPeopleConsultedForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
      expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
    })

    it('should submit form and redirect to next route given previous page was check your answers and user is changing the answer from No to Yes', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }
      req.journeyData = {
        educationSupportPlanDto: {
          ...aValidEducationSupportPlanDto(),
          wereOtherPeopleConsulted: false,
          otherPeopleConsulted: undefined,
        },
      }
      req.body = {
        wereOtherPeopleConsulted: YesNoValue.YES,
      }

      const expectedNextRoute = 'other-people-consulted/add-person?submitToCheckAnswers=true' // expect Add Person as the next page because the user has changed from No to Yes, so we need to collect additional information
      const expectedEducationSupportPlanDto = {
        ...aValidEducationSupportPlanDto(),
        wereOtherPeopleConsulted: true,
        otherPeopleConsulted: undefined as Array<{ name: string; jobRole: string }>,
      }

      // When
      await controller.submitOtherPeopleConsultedForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
      expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
    })

    it('should submit form and redirect to next route given previous page was check your answers and user does not change their answer from Yes', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }
      req.journeyData = {
        educationSupportPlanDto: {
          ...aValidEducationSupportPlanDto(),
          wereOtherPeopleConsulted: true,
          otherPeopleConsulted: [{ name: 'A Teacher', jobRole: 'Education Instructor' }],
        },
      }
      req.body = {
        wereOtherPeopleConsulted: YesNoValue.YES,
      }

      const expectedNextRoute = 'check-your-answers' // expect Check Your Answers as the next page because the user has not changed their answer
      const expectedEducationSupportPlanDto = {
        ...aValidEducationSupportPlanDto(),
        wereOtherPeopleConsulted: true,
        otherPeopleConsulted: [{ name: 'A Teacher', jobRole: 'Education Instructor' }],
      }

      // When
      await controller.submitOtherPeopleConsultedForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
      expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
    })

    it('should submit form and redirect to next route given previous page was check your answers and user does not change their answer from No', async () => {
      // Given
      req.query = { submitToCheckAnswers: 'true' }
      req.journeyData = {
        educationSupportPlanDto: {
          ...aValidEducationSupportPlanDto(),
          wereOtherPeopleConsulted: false,
          otherPeopleConsulted: undefined,
        },
      }
      req.body = {
        wereOtherPeopleConsulted: YesNoValue.NO,
      }

      const expectedNextRoute = 'check-your-answers' // expect Check Your Answers as the next page because the user has not changed their answer
      const expectedEducationSupportPlanDto = {
        ...aValidEducationSupportPlanDto(),
        wereOtherPeopleConsulted: false,
        otherPeopleConsulted: undefined as Array<{ name: string; jobRole: string }>,
      }

      // When
      await controller.submitOtherPeopleConsultedForm(req, res, next)

      // Then
      expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
      expect(req.journeyData.educationSupportPlanDto).toEqual(expectedEducationSupportPlanDto)
    })
  })
})
