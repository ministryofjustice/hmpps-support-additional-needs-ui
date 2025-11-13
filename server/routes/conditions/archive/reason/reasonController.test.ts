import { Request, Response } from 'express'
import ReasonController from './reasonController'
import ConditionService from '../../../../services/conditionService'
import AuditService from '../../../../services/auditService'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import { aValidConditionDto } from '../../../../testsupport/conditionDtoTestDataBuilder'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/conditionService')

describe('reasonController', () => {
  const conditionService = new ConditionService(null) as jest.Mocked<ConditionService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new ReasonController(conditionService, auditService)

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const prisonNamesById = Result.fulfilled({ BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' })

  const conditionReference = '518d65dc-2866-46a7-94c0-ffb331e66061'
  const conditionDto = aValidConditionDto({
    prisonNumber,
    reference: conditionReference,
    archiveReason: null,
  })

  const flash = jest.fn()
  const req = {
    session: {},
    user: { username },
    journeyData: {},
    body: {},
    params: { prisonNumber },
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: {
      prisonerSummary,
      prisonNamesById,
      user: { username, activeCaseLoadId: 'BXI' },
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = { conditionDto }
  })

  it('should render the view when there is no previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/conditions/reason/archive-journey/index'
    const expectedViewModel = {
      prisonerSummary,
      prisonNamesById,
      dto: conditionDto,
      errorRecordingCondition: false,
      form: { archiveReason: '' },
      mode: 'archive',
    }

    // When
    await controller.getReasonView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    const invalidForm = {
      archiveReason: ['not-a-valid-value'],
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/conditions/reason/archive-journey/index'
    const expectedViewModel = {
      prisonerSummary,
      prisonNamesById,
      dto: conditionDto,
      errorRecordingCondition: false,
      form: invalidForm,
      mode: 'archive',
    }

    // When
    await controller.getReasonView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should submit form and redirect to next route given calling API is successful', async () => {
    // Given
    req.body = {
      archiveReason: 'Condition is not relevant and was recorded in error',
    }
    conditionService.archiveCondition.mockResolvedValue(null)

    const expectedConditionDto = {
      ...conditionDto,
      prisonId: 'BXI',
      archiveReason: 'Condition is not relevant and was recorded in error',
    }
    const expectedNextRoute = `/profile/${prisonNumber}/conditions#archived-conditions`

    // When
    await controller.submitReasonForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Condition moved to History')
    expect(req.journeyData.conditionDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(conditionService.archiveCondition).toHaveBeenCalledWith(username, conditionReference, expectedConditionDto)
    expect(auditService.logArchiveCondition).toHaveBeenCalledWith(
      expect.objectContaining({
        details: {
          conditionReference,
        },
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        who: username,
      }),
    )
  })

  it('should submit form and redirect to next route given calling API is not successful', async () => {
    // Given
    req.body = {
      archiveReason: 'Condition is not relevant and was recorded in error',
    }

    conditionService.archiveCondition.mockRejectedValue(new Error('Internal Server Error'))

    const expectedConditionDto = {
      ...conditionDto,
      prisonId: 'BXI',
      archiveReason: 'Condition is not relevant and was recorded in error',
    }
    const expectedNextRoute = 'reason'

    // When
    await controller.submitReasonForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.conditionDto).toEqual(conditionDto)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(conditionService.archiveCondition).toHaveBeenCalledWith(username, conditionReference, expectedConditionDto)
    expect(auditService.logArchiveCondition).not.toHaveBeenCalled()
  })
})
