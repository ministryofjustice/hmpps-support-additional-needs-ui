import { Request, Response } from 'express'
import DetailController from './detailController'
import ChallengeService from '../../../../services/challengeService'
import aValidChallengeResponseDto from '../../../../testsupport/challengeResponseDtoTestDataBuilder'
import ChallengeIdentificationSource from '../../../../enums/challengeIdentificationSource'
import ChallengeType from '../../../../enums/challengeType'
import AuditService from '../../../../services/auditService'

jest.mock('../../../../services/auditService')
jest.mock('../../../../services/challengeService')

describe('detailController', () => {
  const mockedChallengeService = new ChallengeService(null) as jest.Mocked<ChallengeService>
  const auditService = new AuditService(null) as jest.Mocked<AuditService>
  const controller = new DetailController(mockedChallengeService, auditService)

  const username = 'FRED_123'
  const prisonNumber = 'A1234BC'
  const challengeReference = '518d65dc-2866-46a7-94c0-ffb331e66061'

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
      challengeDto: aValidChallengeResponseDto({
        reference: challengeReference,
        challengeTypeCode: ChallengeType.ARITHMETIC,
        symptoms: 'Has difficulty adding up',
        howIdentified: [ChallengeIdentificationSource.CONVERSATIONS],
        howIdentifiedOther: null,
      }),
    }
  })

  it('should render the view when there is no previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/challenges/detail/edit-journey/index'
    const expectedViewModel = {
      category: ChallengeType.ARITHMETIC,
      errorRecordingChallenge: false,
      form: {
        description: 'Has difficulty adding up',
        howIdentified: [ChallengeIdentificationSource.CONVERSATIONS],
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

    const expectedViewTemplate = 'pages/challenges/detail/edit-journey/index'
    const expectedViewModel = {
      category: ChallengeType.ARITHMETIC,
      form: invalidForm,
      errorRecordingChallenge: false,
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
    const challengeResponseDto = aValidChallengeResponseDto({ prisonNumber, reference: challengeReference })
    req.journeyData = { challengeDto: challengeResponseDto }
    req.body = {
      description: 'A description of the challenge',
      howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
      howIdentifiedOther: 'Other prisoners often mention this to me in passing',
    }
    mockedChallengeService.updateChallenge.mockResolvedValue(null)

    const expectedChallengeDto = {
      ...challengeResponseDto,
      prisonId: 'BXI',
      symptoms: 'A description of the challenge',
      howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
      howIdentifiedOther: 'Other prisoners often mention this to me in passing',
    }
    const expectedNextRoute = `/profile/${prisonNumber}/challenges`

    // When
    await controller.submitDetailForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Challenge updated')
    expect(req.journeyData.challengeDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(mockedChallengeService.updateChallenge).toHaveBeenCalledWith(
      username,
      challengeReference,
      expectedChallengeDto,
    )
    expect(auditService.logEditChallenge).toHaveBeenCalledWith(
      expect.objectContaining({
        details: {
          challengeReference,
        },
        subjectId: prisonNumber,
        subjectType: 'PRISONER_ID',
        who: username,
      }),
    )
  })

  it('should submit form and redirect to next route given calling API is not successful', async () => {
    // Given
    const challengeResponseDto = aValidChallengeResponseDto({ prisonNumber, reference: challengeReference })
    req.journeyData = { challengeDto: challengeResponseDto }
    req.body = {
      description: 'A description of the challenge',
      howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
      howIdentifiedOther: 'Other prisoners often mention this to me in passing',
    }

    mockedChallengeService.updateChallenge.mockRejectedValue(new Error('Internal Server Error'))

    const expectedChallengeDto = {
      ...challengeResponseDto,
      prisonId: 'BXI',
      symptoms: 'A description of the challenge',
      howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
      howIdentifiedOther: 'Other prisoners often mention this to me in passing',
    }
    const expectedNextRoute = 'detail'

    // When
    await controller.submitDetailForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.challengeDto).toEqual(challengeResponseDto)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(mockedChallengeService.updateChallenge).toHaveBeenCalledWith(
      username,
      challengeReference,
      expectedChallengeDto,
    )
    expect(auditService.logEditChallenge).not.toHaveBeenCalled()
  })
})
