import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import detailSchema from './detailSchema'

describe('detailSchema', () => {
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
    req.originalUrl = '/support-strategies/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/detail'
  })

  it('happy path - validation passes', async () => {
    // Given
    const requestBody = { description: `A description of the person's support strategy` }
    req.body = requestBody

    // When
    await validate(detailSchema)(req, res, next)

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
  ])('sad path - description field validation fails - %s', async description => {
    // Given
    const requestBody = { description }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#description',
        text: 'Enter a description of the support strategy',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(detailSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/support-strategies/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/detail',
      expectedErrors,
    )
  })

  it('sad path - description field length validation fails', async () => {
    // Given
    const requestBody = { description: 'a'.repeat(4001) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#description',
        text: 'Description of the support strategy must be 4000 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(detailSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/support-strategies/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/detail',
      expectedErrors,
    )
  })
})
