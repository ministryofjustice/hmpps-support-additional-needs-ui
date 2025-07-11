import { Request, Response } from 'express'
import ChallengesController from './challengesController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'

describe('challengesController', () => {
  const controller = new ChallengesController()

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
