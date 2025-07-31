import { Request, Response } from 'express'
import ChallengesController from './challengesController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidChallengeResponse } from '../../../testsupport/challengeResponseTestDataBuilder'

describe('challengesController', () => {
  const controller = new ChallengesController()

  const prisonerSummary = aValidPrisonerSummary()
  const challenges = aValidChallengeResponse()

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, challenges },
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
      challengeList: challenges,
      tab: 'challenges',
    }

    // When
    await controller.getChallengesView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
