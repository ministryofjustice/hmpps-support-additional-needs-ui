import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import deleteReasonSchema from './deleteReasonSchema'

describe('deleteReasonSchema (ALN screener)', () => {
  const req = {
    originalUrl: '',
    body: {},
    flash: jest.fn(),
  } as unknown as Request
  const res = {
    redirectWithErrors: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.originalUrl = '/aln-screener/A1234BC/delete/473e9ee4-37d6-4afb-92a2-5729b10cc60f/reason'
  })

  it('DATA_PROCESSING_OBJECTION passes validation', async () => {
    req.body = { deleteReason: 'DATA_PROCESSING_OBJECTION' }

    await validate(deleteReasonSchema())(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it('ENTERED_IN_ERROR passes validation', async () => {
    req.body = { deleteReason: 'ENTERED_IN_ERROR' }

    await validate(deleteReasonSchema())(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([null, undefined, ''])(
    'deleteReason missing (%s) returns the mandatory error message',
    async deleteReason => {
      const requestBody = { deleteReason }
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        { href: '#deleteReason', text: 'Add reason for deleting screener challenges and strengths' },
      ]

      await validate(deleteReasonSchema())(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', JSON.stringify(requestBody))
      expect(res.redirectWithErrors).toHaveBeenCalledWith(req.originalUrl, expectedErrors)
    },
  )

  it('invalid deleteReason value returns the mandatory error message', async () => {
    req.body = { deleteReason: 'NOT_A_VALID_REASON' }

    const expectedErrors: Array<Error> = [
      { href: '#deleteReason', text: 'Add reason for deleting screener challenges and strengths' },
    ]

    await validate(deleteReasonSchema())(req, res, next)

    expect(next).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).toHaveBeenCalledWith(req.originalUrl, expectedErrors)
  })
})
