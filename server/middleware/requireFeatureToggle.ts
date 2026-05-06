import { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import config from '../config'

const requireFeatureToggle =
  (toggle: keyof typeof config.featureToggles) =>
  (_req: Request, _res: Response, next: NextFunction): void => {
    if (!config.featureToggles[toggle]) {
      next(createError(404))
      return
    }
    next()
  }

export default requireFeatureToggle
