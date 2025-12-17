import { NextFunction, Request, Response } from 'express'

export default class AdditionalNeedsContentFragmentController {
  getAdditionalNeedsContentFragment = async (req: Request, res: Response, next: NextFunction) => {
    const { additionalNeedsFactors } = res.locals

    const viewRenderArgs = { additionalNeedsFactors }
    return res.render('content-fragments/additional-needs/index', viewRenderArgs)
  }
}
