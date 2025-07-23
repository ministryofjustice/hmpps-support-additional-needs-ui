import { Request, Response } from 'express'
import ChallengesController from './challengesController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import ChallengeService from '../../../services/challengeService'

jest.mock('../../../services/challengeService')

describe('challengesController', () => {
  const mockedChallengeService = new ChallengeService(null) as jest.Mocked<ChallengeService>
  const controller = new ChallengesController(mockedChallengeService)

  const prisonerSummary = aValidPrisonerSummary()

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/challenges/index'
    const expectedViewModel = {
      prisonerSummary,
      tab: 'challenges',
    }

    // When
    await controller.getChallengesView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
