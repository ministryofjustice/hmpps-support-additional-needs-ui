import { Request, Response } from 'express'
import DetailController from './detailController'
import aValidStrengthDto from '../../../../testsupport/strengthDtoTestDataBuilder'
import StrengthIdentificationSource from '../../../../enums/strengthIdentificationSource'
import { ChallengeService } from '../../../../services'

describe('detailController', () => {
  const mockedChallengeService = new ChallengeService(null) as jest.Mocked<ChallengeService>
  const controller = new DetailController(mockedChallengeService)

  const req = {
    session: {},
    journeyData: {},
    body: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
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
        strengthTypeCode: StrengthIdentificationSource.COLLEAGUE_INFO,
        symptoms: undefined,
        howIdentified: undefined,
        howIdentifiedOther: undefined,
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/strengths/detail/index'
    const expectedViewModel = {
      category: StrengthIdentificationSource.COLLEAGUE_INFO,
      form: {
        symptoms: undefined as string,
        howIdentified: [] as Array<StrengthIdentificationSource>,
        howIdentifiedOther: undefined as string,
      },
    }

    // When
    await controller.getDetailView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      howIdentified: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/strengths/detail/index'
    const expectedViewModel = { category: StrengthIdentificationSource.COLLEAGUE_INFO, form: invalidForm }

    // When
    await controller.getDetailView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
