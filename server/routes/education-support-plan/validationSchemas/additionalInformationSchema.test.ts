import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import additionalInformationSchema from './additionalInformationSchema'

describe('additionalInformationSchema', () => {
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
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/additional-information'
  })

  it.each([
    { additionalInformation: null },
    { additionalInformation: undefined },
    { additionalInformation: '' },
    { additionalInformation: 'Some additional information pertinent to the education support plan' },
  ])('happy path - validation passes - additionalInformation: additionalInformation', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(additionalInformationSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it('sad path - validation of additionalInformation field length validation fails', async () => {
    // Given
    const requestBody = { additionalInformation: 'a'.repeat(4001) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      { href: '#additionalInformation', text: 'Any additional information must be 4000 characters or less' },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(additionalInformationSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/additional-information',
      expectedErrors,
    )
  })
})
