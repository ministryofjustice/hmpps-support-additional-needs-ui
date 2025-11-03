import { Request, Response } from 'express'
import DetailController from './detailController'
import StrengthService from '../../../../services/strengthService'
import { aValidStrengthResponseDto } from '../../../../testsupport/strengthResponseDtoTestDataBuilder'
import StrengthIdentificationSource from '../../../../enums/strengthIdentificationSource'
import StrengthType from '../../../../enums/strengthType'
import AuditService from '../../../../services/auditService'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/strengthService')

describe('detailController', () => {
  const strengthService = new StrengthService(null) as jest.Mocked<StrengthService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new DetailController(strengthService, auditService)

  const username = 'FRED_123'
  const prisonNumber = 'A1234BC'
  const strengthReference = '518d65dc-2866-46a7-94c0-ffb331e66061'

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
    redirectWithErrors: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: { user: { username, activeCaseLoadId: 'BXI' } },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {
      strengthDto: aValidStrengthResponseDto({
        reference: strengthReference,
        strengthTypeCode: StrengthType.ARITHMETIC,
        symptoms: 'Has difficulty adding up',
        howIdentified: [StrengthIdentificationSource.CONVERSATIONS],
        howIdentifiedOther: null,
      }),
    }
  })

  it('should render the view when there is no previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/strengths/detail/edit-journey/index'
    const expectedViewModel = {
      category: StrengthType.ARITHMETIC,
      errorRecordingStrength: false,
      form: {
        description: 'Has difficulty adding up',
        howIdentified: [StrengthIdentificationSource.CONVERSATIONS],
        howIdentifiedOther: null as string,
      },
      mode: 'edit',
    }

    // When
    await controller.getDetailView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    const invalidForm = {
      howIdentified: ['not-a-valid-value'],
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/strengths/detail/edit-journey/index'
    const expectedViewModel = {
      category: StrengthType.ARITHMETIC,
      form: invalidForm,
      errorRecordingStrength: false,
      mode: 'edit',
    }

    // When
    await controller.getDetailView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should submit form and redirect to next route given calling API is successful', async () => {
    // Given
    const strengthResponseDto = aValidStrengthResponseDto({ prisonNumber, reference: strengthReference })
    req.journeyData = { strengthDto: strengthResponseDto }
    req.body = {
      description: 'A description of the strength',
      howIdentified: [StrengthIdentificationSource.CONVERSATIONS, StrengthIdentificationSource.OTHER],
      howIdentifiedOther: 'Other prisoners often mention this to me in passing',
    }
    strengthService.updateStrength.mockResolvedValue(null)

    const expectedStrengthDto = {
      ...strengthResponseDto,
      prisonId: 'BXI',
      symptoms: 'A description of the strength',
      howIdentified: [StrengthIdentificationSource.CONVERSATIONS, StrengthIdentificationSource.OTHER],
      howIdentifiedOther: 'Other prisoners often mention this to me in passing',
    }
    const expectedNextRoute = `/profile/${prisonNumber}/strengths`

    // When
    await controller.submitDetailForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Strength updated')
    expect(req.journeyData.strengthDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(strengthService.updateStrength).toHaveBeenCalledWith(username, strengthReference, expectedStrengthDto)
    expect(auditService.logEditStrength).toHaveBeenCalledWith(
      expect.objectContaining({
        details: {
          strengthReference,
        },
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        who: username,
      }),
    )
  })

  it('should submit form and redirect to next route given calling API is not successful', async () => {
    // Given
    const strengthResponseDto = aValidStrengthResponseDto({ prisonNumber, reference: strengthReference })
    req.journeyData = { strengthDto: strengthResponseDto }
    req.body = {
      description: 'A description of the strength',
      howIdentified: [StrengthIdentificationSource.CONVERSATIONS, StrengthIdentificationSource.OTHER],
      howIdentifiedOther: 'Other prisoners often mention this to me in passing',
    }

    strengthService.updateStrength.mockRejectedValue(new Error('Internal Server Error'))

    const expectedStrengthDto = {
      ...strengthResponseDto,
      prisonId: 'BXI',
      symptoms: 'A description of the strength',
      howIdentified: [StrengthIdentificationSource.CONVERSATIONS, StrengthIdentificationSource.OTHER],
      howIdentifiedOther: 'Other prisoners often mention this to me in passing',
    }
    const expectedNextRoute = 'detail'

    // When
    await controller.submitDetailForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.strengthDto).toEqual(strengthResponseDto)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(strengthService.updateStrength).toHaveBeenCalledWith(username, strengthReference, expectedStrengthDto)
    expect(auditService.logEditStrength).not.toHaveBeenCalled()
  })
})
