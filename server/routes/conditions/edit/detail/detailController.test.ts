import { Request, Response } from 'express'
import DetailController from './detailController'
import { aValidConditionDto } from '../../../../testsupport/conditionDtoTestDataBuilder'
import ConditionType from '../../../../enums/conditionType'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import ConditionService from '../../../../services/conditionService'
import ConditionSource from '../../../../enums/conditionSource'
import AuditService from '../../../../services/auditService'
import conditionsThatRequireNaming from '../../conditionsThatRequireNaming'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/conditionService')

describe('detailController', () => {
  const conditionService = new ConditionService(null) as jest.Mocked<ConditionService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new DetailController(conditionService, auditService)

  const username = 'FRED_123'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const conditionDto = aValidConditionDto({
    conditionTypeCode: ConditionType.VISUAL_IMPAIR,
    source: ConditionSource.SELF_DECLARED,
    conditionName: 'Colour blindness',
    conditionDetails: 'Has red-green colour blindness',
  })

  const flash = jest.fn()

  const req = {
    user: { username },
    session: {},
    journeyData: {},
    body: {},
    params: { prisonNumber },
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary, user: { username, activeCaseLoadId: 'BXI' } },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = { conditionDto }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/conditions/details/edit-journey/index'
    const expectedViewModel = {
      form: {
        conditionSource: 'SELF_DECLARED',
        conditionDetails: 'Has red-green colour blindness',
        conditionName: 'Colour blindness',
      },
      prisonerSummary,
      dto: conditionDto,
      mode: 'edit',
      conditionsThatRequireNaming,
      errorRecordingConditions: false,
    }

    // When
    await controller.getDetailView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    const invalidForm = {
      conditionSource: ['not-a-valid-value'],
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/conditions/details/edit-journey/index'
    const expectedViewModel = {
      form: invalidForm,
      prisonerSummary,
      dto: conditionDto,
      mode: 'edit',
      conditionsThatRequireNaming,
      errorRecordingConditions: false,
    }

    // When
    await controller.getDetailView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should render view given api errors from previous submission', async () => {
    // Given
    flash.mockReturnValue(['true'])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/conditions/details/edit-journey/index'
    const expectedViewModel = {
      form: {
        conditionSource: 'SELF_DECLARED',
        conditionDetails: 'Has red-green colour blindness',
        conditionName: 'Colour blindness',
      },
      prisonerSummary,
      dto: conditionDto,
      mode: 'edit',
      conditionsThatRequireNaming,
      errorRecordingConditions: true,
    }

    // When
    await controller.getDetailView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should submit form and redirect to next route given calling API is successful', async () => {
    // Given
    req.body = {
      conditionSource: 'CONFIRMED_DIAGNOSIS',
      conditionDetails: 'Has red-green colour blindness. Confirmed by an optometrist.',
      conditionName: 'Colour blindness',
    }

    conditionService.updateCondition.mockResolvedValue(null)

    const expectedConditionDto = aValidConditionDto({
      prisonId: 'BXI',
      conditionTypeCode: ConditionType.VISUAL_IMPAIR,
      source: ConditionSource.CONFIRMED_DIAGNOSIS,
      conditionName: 'Colour blindness',
      conditionDetails: 'Has red-green colour blindness. Confirmed by an optometrist.',
    })
    const expectedNextRoute = `/profile/${prisonNumber}/conditions`

    // When
    await controller.submitDetailForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Condition updated')
    expect(req.journeyData.conditionDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(conditionService.updateCondition).toHaveBeenCalledWith(
      username,
      conditionDto.reference,
      expectedConditionDto,
    )
    expect(auditService.logEditCondition).toHaveBeenCalledWith(
      expect.objectContaining({
        details: {
          conditionReference: conditionDto.reference,
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
      conditionSource: 'CONFIRMED_DIAGNOSIS',
      conditionDetails: 'Has red-green colour blindness. Confirmed by an optometrist.',
      conditionName: 'Colour blindness',
    }

    conditionService.updateCondition.mockRejectedValue(new Error('Internal Server Error'))

    const expectedConditionDto = aValidConditionDto({
      prisonId: 'BXI',
      conditionTypeCode: ConditionType.VISUAL_IMPAIR,
      source: ConditionSource.CONFIRMED_DIAGNOSIS,
      conditionName: 'Colour blindness',
      conditionDetails: 'Has red-green colour blindness. Confirmed by an optometrist.',
    })
    const expectedNextRoute = 'detail'

    // When
    await controller.submitDetailForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.conditionDto).toEqual(conditionDto)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(conditionService.updateCondition).toHaveBeenCalledWith(
      username,
      conditionDto.reference,
      expectedConditionDto,
    )
    expect(auditService.logEditCondition).not.toHaveBeenCalled()
  })
})
