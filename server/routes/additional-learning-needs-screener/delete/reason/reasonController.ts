import { NextFunction, Request, Response } from 'express'
import type { ScreenerDeletionDto } from 'dto'

export default class ReasonController {
  getReasonView = async (req: Request, res: Response, _next: NextFunction) => {
    const { invalidForm, prisonerSummary } = res.locals
    const dto = req.journeyData.screenerDeletionDto as ScreenerDeletionDto

    const form = invalidForm ?? { deleteReason: dto.deleteReason ?? '' }

    // Capture the entry-point overview the first time the user lands on the reason page so
    // we can return them to where they came from after a successful delete. The Delete link
    // on each card carries `?from=strengths` or `?from=challenges` to identify the entry tab.
    if (!dto.returnTo) {
      dto.returnTo = resolveReturnTo(req)
      req.journeyData.screenerDeletionDto = dto
    }

    const viewRenderArgs = {
      prisonerSummary,
      dto,
      form,
    }

    return res.render('pages/additional-learning-needs-screener/delete/reason/index', viewRenderArgs)
  }

  submitReasonForm = async (req: Request, res: Response, _next: NextFunction) => {
    const { deleteReason } = req.body

    const dto = req.journeyData.screenerDeletionDto as ScreenerDeletionDto
    dto.deleteReason = deleteReason
    req.journeyData.screenerDeletionDto = dto

    return res.redirect('review')
  }
}

const resolveReturnTo = (req: Request): string => {
  const { prisonNumber } = req.params
  const from = typeof req.query.from === 'string' ? req.query.from : undefined
  if (from === 'strengths') return `/profile/${prisonNumber}/strengths`
  if (from === 'challenges') return `/profile/${prisonNumber}/challenges`
  return `/profile/${prisonNumber}/overview`
}
