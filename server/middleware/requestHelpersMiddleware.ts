import { NextFunction, Request, Response } from 'express'

/**
 * Middleware that implements helper functions that are defined on the [Request] interface in /server/@types/express/index.d.ts
 */
export default function requestHelpersMiddleware(req: Request, res: Response, next: NextFunction) {
  req.userClickedOnButton = function userClickedOnButton(buttonName: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.body, buttonName)
  }
  next()
}
