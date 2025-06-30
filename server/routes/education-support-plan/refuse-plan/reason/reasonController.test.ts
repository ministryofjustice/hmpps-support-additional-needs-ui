import { Request, Response } from 'express'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import ReasonController from './reasonController'
import PlanCreationScheduleExemptionReason from '../../../../enums/planCreationScheduleExemptionReason'

describe('reasonController', () => {
  const controller = new ReasonController()

  const prisonerSummary = aValidPrisonerSummary()

  const req = {
    session: {},
    journeyData: {},
    body: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {}
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/education-support-plan/refuse-plan/reason/index'
    const expectedViewModel = {
      prisonerSummary,
      form: undefined as unknown,
    }

    // When
    await controller.getRefusePlanReasonView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      refusalReason: PlanCreationScheduleExemptionReason.EXEMPT_NOT_REQUIRED,
      refusalReasonDetails: 'a'.repeat(201),
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/education-support-plan/refuse-plan/reason/index'
    const expectedViewModel = { prisonerSummary, form: invalidForm }

    // When
    await controller.getRefusePlanReasonView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
