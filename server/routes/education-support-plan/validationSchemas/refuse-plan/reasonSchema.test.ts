import { Request, Response } from 'express'
import { validate } from '../../../../middleware/validationMiddleware'
import reasonSchema from './reasonSchema'
import type { Error } from '../../../../filters/findErrorFilter'

describe('reasonSchema', () => {
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
    req.originalUrl = '/education-support-plan/A1234BC/refuse-plan/61375886-8ec3-4ed4-a017-a0525817f14a/reason'
  })

  it.each([
    { refusalReason: 'EXEMPT_REFUSED_TO_ENGAGE' },
    { refusalReason: 'EXEMPT_NOT_REQUIRED' },
    { refusalReason: 'EXEMPT_INACCURATE_IDENTIFICATION' },
  ])('happy path - validation passes - refusalReason: $refusalReason', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(reasonSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { refusalReason: '' },
    { refusalReason: undefined },
    { refusalReason: null },
    { refusalReason: 'a-non-supported-value' },
  ])('sad path - validation of refusalReason field fails - refusalReason: $refusalReason', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#refusalReason',
        text: 'Select the reason that the education support plan is being refused',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(reasonSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/refuse-plan/61375886-8ec3-4ed4-a017-a0525817f14a/reason',
      expectedErrors,
    )
  })

  it.each([
    { refusalReason: 'EXEMPT_REFUSED_TO_ENGAGE', refusalReasonDetails: { EXEMPT_REFUSED_TO_ENGAGE: 'a'.repeat(201) } },
    { refusalReason: 'EXEMPT_NOT_REQUIRED', refusalReasonDetails: { EXEMPT_NOT_REQUIRED: 'a'.repeat(201) } },
    {
      refusalReason: 'EXEMPT_INACCURATE_IDENTIFICATION',
      refusalReasonDetails: { EXEMPT_INACCURATE_IDENTIFICATION: 'a'.repeat(201) },
    },
  ])(
    'sad path - validation of refusalReasonDetails field length validation fails - refusalReasonDetails: $refusalReasonDetails',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: `#${requestBody.refusalReason}_refusalDetails`,
          text: 'Refusal details must be 200 characters or less',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(reasonSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/refuse-plan/61375886-8ec3-4ed4-a017-a0525817f14a/reason',
        expectedErrors,
      )
    },
  )
})
