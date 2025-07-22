import { Request, Response } from 'express'
import type { ChallengeDto } from 'dto'
import DetailController from './detailController'
import ChallengeService from '../../../../services/challengeService'
import aValidChallengeDto from '../../../../testsupport/challengeDtoTestDataBuilder'
import ChallengeIdentificationSource from '../../../../enums/challengeIdentificationSource'
import ChallengeType from '../../../../enums/challengeType'

jest.mock('../../../../services/challengeService')

describe('detailController', () => {
  const mockedChallengeService = new ChallengeService(null) as jest.Mocked<ChallengeService>
  const controller = new DetailController(mockedChallengeService)

  const username = 'FRED_123'
  const prisonId = 'BXI'
  const prisonNumber = 'A1234BC'

  const flash = jest.fn()

  const req = {
    user: { username },
    session: {},
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
      challengeDto: {
        ...aValidChallengeDto(),
        challengeTypeCode: ChallengeType.ARITHMETIC,
        symptoms: undefined,
        howIdentified: undefined,
        howIdentifiedOther: undefined,
      },
    }
  })

  it('should render the view when there is no previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/challenges/detail/index'
    const expectedViewModel = {
      category: ChallengeType.ARITHMETIC,
      errorRecordingChallenge: false,
      form: {
        symptoms: undefined as string,
        howIdentified: [] as Array<ChallengeIdentificationSource>,
        howIdentifiedOther: undefined as string,
        description: undefined as string,
      },
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
      howIdentified: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/challenges/detail/index'
    const expectedViewModel = {
      category: ChallengeType.ARITHMETIC,
      form: invalidForm,
      errorRecordingChallenge: false,
    }

    // When
    await controller.getDetailView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should submit form and redirect to next route given calling API is successful', async () => {
    // Given
    const challengeDto: ChallengeDto = {
      ...aValidChallengeDto({ prisonNumber, prisonId }),
      symptoms: undefined,
      howIdentified: undefined,
      howIdentifiedOther: undefined,
    }
    req.journeyData = { challengeDto }
    req.body = {
      description: 'A description of the challenge',
      howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
      howIdentifiedOther: 'It has been mentioned to me in passing',
    }

    mockedChallengeService.createChallenges.mockResolvedValue(null)

    const expectedChallengeDto = aValidChallengeDto({
      prisonNumber,
      prisonId,
      symptoms: 'A description of the challenge',
      howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
      howIdentifiedOther: 'It has been mentioned to me in passing',
    })
    const expectedNextRoute = `/profile/${prisonNumber}/challenges`

    // When
    await controller.submitDetailForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Challenge added')
    expect(req.journeyData.challengeDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(mockedChallengeService.createChallenges).toHaveBeenCalledWith(username, [expectedChallengeDto])
  })

  it('should submit form and redirect to next route given calling API is not successful', async () => {
    // Given
    const challengeDto: ChallengeDto = {
      ...aValidChallengeDto({ prisonNumber, prisonId }),
      symptoms: undefined,
      howIdentified: undefined,
      howIdentifiedOther: undefined,
    }
    req.journeyData = { challengeDto }
    req.body = {
      description: 'A description of the challenge',
      howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
      howIdentifiedOther: 'Other prisoners often mention this to me in passing',
    }

    mockedChallengeService.createChallenges.mockRejectedValue(new Error('Internal Server Error'))

    const expectedChallengeDto = aValidChallengeDto({
      prisonNumber,
      prisonId,
      symptoms: 'A description of the challenge',
      howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
      howIdentifiedOther: 'Other prisoners often mention this to me in passing',
    })
    const expectedNextRoute = 'detail'

    // When
    await controller.submitDetailForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.challengeDto).toEqual(challengeDto)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(mockedChallengeService.createChallenges).toHaveBeenCalledWith(username, [expectedChallengeDto])
  })
})
