import { Request, Response } from 'express'
import type { StrengthDto } from 'dto'
import DetailController from './detailController'
import aValidStrengthDto from '../../../../testsupport/strengthDtoTestDataBuilder'
import StrengthIdentificationSource from '../../../../enums/strengthIdentificationSource'
import StrengthService from '../../../../services/strengthService'
import StrengthType from '../../../../enums/strengthType'

jest.mock('../../../../services/strengthService')

describe('detailController', () => {
  const strengthService = new StrengthService(null) as jest.Mocked<StrengthService>
  const controller = new DetailController(strengthService)

  const username = 'A_USER'
  const prisonId = 'MDI'
  const prisonNumber = 'A1234BC'

  const flash = jest.fn()

  const req = {
    session: {},
    user: { username },
    journeyData: {},
    body: {},
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {
      strengthDto: {
        ...aValidStrengthDto(),
        strengthTypeCode: StrengthType.ACTIVE_LISTENING,
        symptoms: undefined,
        howIdentified: undefined,
        howIdentifiedOther: undefined,
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/strengths/detail/index'
    const expectedViewModel = {
      category: StrengthType.ACTIVE_LISTENING,
      form: {
        description: undefined as string,
        howIdentified: [] as Array<StrengthIdentificationSource>,
        howIdentifiedOther: undefined as string,
      },
      errorRecordingStrength: false,
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
      howIdentified: ['not-a-valid-value'],
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/strengths/detail/index'
    const expectedViewModel = {
      category: StrengthType.ACTIVE_LISTENING,
      form: invalidForm,
      errorRecordingStrength: false,
    }

    // When
    await controller.getDetailView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should render view given given api errors from previous submission', async () => {
    // Given
    flash.mockReturnValue(['true'])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/strengths/detail/index'
    const expectedViewModel = {
      category: StrengthType.ACTIVE_LISTENING,
      form: {
        description: undefined as string,
        howIdentified: [] as Array<StrengthIdentificationSource>,
        howIdentifiedOther: undefined as string,
      },
      errorRecordingStrength: true,
    }

    // When
    await controller.getDetailView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should submit form and redirect to next route given calling API is successful', async () => {
    // Given
    const strengthDto: StrengthDto = {
      ...aValidStrengthDto({ prisonNumber, prisonId }),
      symptoms: undefined,
      howIdentified: undefined,
      howIdentifiedOther: undefined,
    }
    req.journeyData = { strengthDto }
    req.body = {
      description: 'A description of the strength',
      howIdentified: [StrengthIdentificationSource.CONVERSATIONS, StrengthIdentificationSource.OTHER],
      howIdentifiedOther: 'Other prisoners often mention this to me in passing',
    }

    strengthService.createStrengths.mockResolvedValue(null)

    const expectedStrengthDto = aValidStrengthDto({
      prisonNumber,
      prisonId,
      symptoms: 'A description of the strength',
      howIdentified: [StrengthIdentificationSource.CONVERSATIONS, StrengthIdentificationSource.OTHER],
      howIdentifiedOther: 'Other prisoners often mention this to me in passing',
    })
    const expectedNextRoute = `/profile/${prisonNumber}/strengths`

    // When
    await controller.submitDetailForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Strength added')
    expect(req.journeyData.strengthDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(strengthService.createStrengths).toHaveBeenCalledWith(username, [expectedStrengthDto])
  })

  it('should submit form and redirect to next route given calling API is not successful', async () => {
    // Given
    const strengthDto: StrengthDto = {
      ...aValidStrengthDto({ prisonNumber, prisonId }),
      symptoms: undefined,
      howIdentified: undefined,
      howIdentifiedOther: undefined,
    }
    req.journeyData = { strengthDto }
    req.body = {
      description: 'A description of the strength',
      howIdentified: [StrengthIdentificationSource.CONVERSATIONS, StrengthIdentificationSource.OTHER],
      howIdentifiedOther: 'Other prisoners often mention this to me in passing',
    }

    strengthService.createStrengths.mockRejectedValue(new Error('Internal Server Error'))

    const expectedStrengthDto = aValidStrengthDto({
      prisonNumber,
      prisonId,
      symptoms: 'A description of the strength',
      howIdentified: [StrengthIdentificationSource.CONVERSATIONS, StrengthIdentificationSource.OTHER],
      howIdentifiedOther: 'Other prisoners often mention this to me in passing',
    })
    const expectedNextRoute = 'detail'

    // When
    await controller.submitDetailForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.strengthDto).toEqual(strengthDto)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(strengthService.createStrengths).toHaveBeenCalledWith(username, [expectedStrengthDto])
  })
})
