import { Request, Response } from 'express'
import type { ScreenerDeletionDto } from 'dto'
import ReviewController from './reviewController'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidAlnScreenerResponseDto } from '../../../../testsupport/alnScreenerDtoTestDataBuilder'
import aValidChallengeResponseDto from '../../../../testsupport/challengeResponseDtoTestDataBuilder'
import { aValidStrengthResponseDto } from '../../../../testsupport/strengthResponseDtoTestDataBuilder'
import ChallengeCategory from '../../../../enums/challengeCategory'
import ChallengeType from '../../../../enums/challengeType'
import StrengthCategory from '../../../../enums/strengthCategory'
import StrengthType from '../../../../enums/strengthType'

describe('delete/review/reviewController (ALN screener)', () => {
  const controller = new ReviewController()

  const username = 'A_DPS_USER'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  let req: Request
  let res: Response
  let next: jest.Mock

  beforeEach(() => {
    next = jest.fn()
    req = {
      session: {},
      user: { username },
      journeyData: {},
      body: {},
      params: { prisonNumber },
    } as unknown as Request
    res = {
      redirect: jest.fn(),
      render: jest.fn(),
      locals: { prisonerSummary, user: { username, activeCaseLoadId: 'BXI' } },
    } as unknown as Response
  })

  describe('getReviewView', () => {
    it('groups the latest screener challenges and strengths by category', async () => {
      const memoryChallenge = aValidChallengeResponseDto({
        challengeTypeCode: ChallengeType.SHORT_TERM_MEMORY,
        challengeCategory: ChallengeCategory.MEMORY,
      })
      const readingChallenge = aValidChallengeResponseDto({
        challengeTypeCode: ChallengeType.READING_COMPREHENSION,
        challengeCategory: ChallengeCategory.LITERACY_SKILLS,
      })
      const literacyStrength = aValidStrengthResponseDto({
        strengthTypeCode: StrengthType.WRITING,
        strengthCategory: StrengthCategory.LITERACY_SKILLS,
      })

      const latestScreener = aValidAlnScreenerResponseDto({
        challenges: [memoryChallenge, readingChallenge],
        strengths: [literacyStrength],
      })

      req.journeyData.screenerDeletionDto = { prisonNumber, latestScreener } as ScreenerDeletionDto

      await controller.getReviewView(req, res, next)

      expect(res.render).toHaveBeenCalledTimes(1)
      const renderedArgs = (res.render as jest.Mock).mock.calls[0]
      expect(renderedArgs[0]).toEqual('pages/additional-learning-needs-screener/delete/review/index')

      const { groupedChallenges, groupedStrengths, dto, prisonerSummary: renderedPrisoner } = renderedArgs[1]
      expect(renderedPrisoner).toEqual(prisonerSummary)
      expect(dto).toEqual({ prisonNumber, latestScreener })
      expect(Object.keys(groupedChallenges)).toEqual(
        [ChallengeCategory.LITERACY_SKILLS, ChallengeCategory.MEMORY].sort(),
      )
      expect(groupedChallenges[ChallengeCategory.MEMORY]).toEqual([memoryChallenge])
      expect(groupedChallenges[ChallengeCategory.LITERACY_SKILLS]).toEqual([readingChallenge])
      expect(Object.keys(groupedStrengths)).toEqual([StrengthCategory.LITERACY_SKILLS])
      expect(groupedStrengths[StrengthCategory.LITERACY_SKILLS]).toEqual([literacyStrength])
    })

    it('renders even when the screener has no challenges or strengths', async () => {
      const latestScreener = aValidAlnScreenerResponseDto({ challenges: [], strengths: [] })
      req.journeyData.screenerDeletionDto = { prisonNumber, latestScreener } as ScreenerDeletionDto

      await controller.getReviewView(req, res, next)

      const { groupedChallenges, groupedStrengths } = (res.render as jest.Mock).mock.calls[0][1]
      expect(groupedChallenges).toEqual({})
      expect(groupedStrengths).toEqual({})
    })
  })

  describe('submitReviewForm', () => {
    it('redirects to confirm', async () => {
      await controller.submitReviewForm(req, res, next)
      expect(res.redirect).toHaveBeenCalledWith('confirm')
    })
  })
})
