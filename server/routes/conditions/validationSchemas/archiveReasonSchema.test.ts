import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import archiveReasonSchema from './archiveReasonSchema'

describe('archiveReasonSchema', () => {
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
      '/conditions/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/archive/473e9ee4-37d6-4afb-92a2-5729b10cc60f/reason'
  })

  it('happy path - validation passes', async () => {
    // Given
    const requestBody = { archiveReason: 'This condition was incorrectly added by mistake' }
    req.body = requestBody

    // When
    await validate(archiveReasonSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    //
    null,
    undefined,
    '',
    ' ',
    `

    `,
  ])('sad path - archiveReason field validation fails - %s', async archiveReason => {
    // Given
    const requestBody = { archiveReason }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#archiveReason',
        text: 'Add reason for moving this condition to the History',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(archiveReasonSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/conditions/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/archive/473e9ee4-37d6-4afb-92a2-5729b10cc60f/reason',
      expectedErrors,
    )
  })

  it('sad path - archiveReason field length validation fails', async () => {
    // Given
    const requestBody = { archiveReason: 'a'.repeat(4001) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#archiveReason',
        text: 'Reason for moving this condition to the History must be 4000 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(archiveReasonSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/conditions/A1234BC/187168d1-121c-42bf-b456-47711924ffa4/archive/473e9ee4-37d6-4afb-92a2-5729b10cc60f/reason',
      expectedErrors,
    )
  })
})
