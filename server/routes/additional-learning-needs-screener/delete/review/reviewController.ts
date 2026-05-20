import { NextFunction, Request, Response } from 'express'
import type { ChallengeResponseDto, ScreenerDeletionDto, StrengthResponseDto } from 'dto'
import enumComparator from '../../../enumComparator'

type GroupedChallenges = Record<string, Array<ChallengeResponseDto>>
type GroupedStrengths = Record<string, Array<StrengthResponseDto>>

export default class ReviewController {
  getReviewView = async (req: Request, res: Response, _next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const dto = req.journeyData.screenerDeletionDto as ScreenerDeletionDto

    const groupedChallenges = groupChallengesByCategory(dto.latestScreener?.challenges ?? [])
    const groupedStrengths = groupStrengthsByCategory(dto.latestScreener?.strengths ?? [])

    const viewRenderArgs = {
      prisonerSummary,
      dto,
      groupedChallenges,
      groupedStrengths,
    }

    return res.render('pages/additional-learning-needs-screener/delete/review/index', viewRenderArgs)
  }

  submitReviewForm = async (req: Request, res: Response, _next: NextFunction) => {
    return res.redirect('confirm')
  }
}

const groupChallengesByCategory = (challenges: Array<ChallengeResponseDto>): GroupedChallenges => {
  const grouped = challenges.reduce<GroupedChallenges>((acc, challenge) => {
    const category = challenge.challengeCategory
    acc[category] = acc[category] ?? []
    acc[category].push(challenge)
    return acc
  }, {})
  return sortKeys(grouped, (left, right) => enumComparator(left, right))
}

const groupStrengthsByCategory = (strengths: Array<StrengthResponseDto>): GroupedStrengths => {
  const grouped = strengths.reduce<GroupedStrengths>((acc, strength) => {
    const category = strength.strengthCategory
    acc[category] = acc[category] ?? []
    acc[category].push(strength)
    return acc
  }, {})
  return sortKeys(grouped, (left, right) => enumComparator(left, right))
}

const sortKeys = <T>(record: Record<string, T>, comparator: (a: string, b: string) => number): Record<string, T> => {
  return Object.keys(record)
    .sort(comparator)
    .reduce<Record<string, T>>((acc, key) => {
      acc[key] = record[key]
      return acc
    }, {})
}
