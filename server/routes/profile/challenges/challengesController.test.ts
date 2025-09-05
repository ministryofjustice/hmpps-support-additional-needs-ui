import { Request, Response } from 'express'
import ChallengesController from './challengesController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../utils/result/result'
import { aValidAlnScreenerList } from '../../../testsupport/alnScreenerDtoTestDataBuilder'
import aPlanLifecycleStatusDto from '../../../testsupport/planLifecycleStatusDtoTestDataBuilder'
import aValidChallengeResponseDto from '../../../testsupport/challengeResponseDtoTestDataBuilder'

describe('challengesController', () => {
  const controller = new ChallengesController()

  const prisonerSummary = aValidPrisonerSummary()
  const challenges = Result.fulfilled([aValidChallengeResponseDto()])
  const alnScreeners = Result.fulfilled(aValidAlnScreenerList())
  const prisonNamesById = Result.fulfilled({ BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' })
  const educationSupportPlanLifecycleStatus = Result.fulfilled(aPlanLifecycleStatusDto())

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, challenges, alnScreeners, prisonNamesById, educationSupportPlanLifecycleStatus },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/challenges/index'

    const expectedViewModel = expect.objectContaining({
      prisonNamesById,
      prisonerSummary,
      educationSupportPlanLifecycleStatus,
      tab: 'challenges',
      groupedChallenges: expect.objectContaining({
        status: 'fulfilled',
      }),
    })

    // When
    await controller.getChallengesView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
