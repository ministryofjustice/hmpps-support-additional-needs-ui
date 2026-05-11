import { NextFunction, Request, Response } from 'express'
import createError from 'http-errors'
import requireFeatureToggle from './requireFeatureToggle'

jest.mock('../config', () => ({
  __esModule: true,
  default: {
    featureToggles: {
      sanDataDeletionEnabled: false,
    },
  },
}))

describe('requireFeatureToggle', () => {
  const req = {} as Request
  const res = {} as Response
  const next: NextFunction = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should call next(NotFound) when the toggle is disabled', () => {
    const middleware = requireFeatureToggle('sanDataDeletionEnabled')

    middleware(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    const error = (next as jest.Mock).mock.calls[0][0]
    expect(error).toEqual(createError(404))
  })
})
