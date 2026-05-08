import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import deleteReasonSchema from './deleteReasonSchema'

describe('deleteReasonSchema', () => {
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
    req.originalUrl =
      '/support-strategies/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/delete/473e9ee4-37d6-4afb-92a2-5729b10cc60f/reason'
  })

  describe('mode: active', () => {
    it('happy path - DATA_PROCESSING_OBJECTION passes validation', async () => {
      const requestBody = { deleteReason: 'DATA_PROCESSING_OBJECTION' }
      req.body = requestBody

      await validate(deleteReasonSchema({ mode: 'active' }))(req, res, next)

      expect(req.body).toEqual(requestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    })

    it('happy path - ENTERED_IN_ERROR passes validation', async () => {
      const requestBody = { deleteReason: 'ENTERED_IN_ERROR' }
      req.body = requestBody

      await validate(deleteReasonSchema({ mode: 'active' }))(req, res, next)

      expect(req.body).toEqual(requestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    })

    it.each([null, undefined, ''])(
      'sad path - deleteReason missing (%s) returns active error message',
      async deleteReason => {
        const requestBody = { deleteReason }
        req.body = requestBody

        const expectedErrors: Array<Error> = [
          {
            href: '#deleteReason',
            text: 'Add reason for deleting support strategy',
          },
        ]
        const expectedInvalidForm = JSON.stringify(requestBody)

        await validate(deleteReasonSchema({ mode: 'active' }))(req, res, next)

        expect(req.body).toEqual(requestBody)
        expect(next).not.toHaveBeenCalled()
        expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
        expect(res.redirectWithErrors).toHaveBeenCalledWith(
          '/support-strategies/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/delete/473e9ee4-37d6-4afb-92a2-5729b10cc60f/reason',
          expectedErrors,
        )
      },
    )

    it('sad path - invalid deleteReason value returns active error message', async () => {
      const requestBody = { deleteReason: 'NOT_A_VALID_REASON' }
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#deleteReason',
          text: 'Add reason for deleting support strategy',
        },
      ]

      await validate(deleteReasonSchema({ mode: 'active' }))(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/support-strategies/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/delete/473e9ee4-37d6-4afb-92a2-5729b10cc60f/reason',
        expectedErrors,
      )
    })
  })

  describe('mode: history', () => {
    it('sad path - deleteReason missing returns history error message', async () => {
      const requestBody: Record<string, unknown> = { deleteReason: undefined }
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#deleteReason',
          text: 'Add reason for deleting history support strategy',
        },
      ]

      await validate(deleteReasonSchema({ mode: 'history' }))(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/support-strategies/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/delete/473e9ee4-37d6-4afb-92a2-5729b10cc60f/reason',
        expectedErrors,
      )
    })
  })
})
