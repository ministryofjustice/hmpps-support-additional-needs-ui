import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import learningNeedsSupportPractitionerSupportSchema from './learningNeedsSupportPractitionerSupportSchema'

describe('learningNeedsSupportPractitionerSupportSchema', () => {
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
    req.originalUrl = '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/lnsp-support'
  })

  it.each([
    { supportRequired: 'NO', details: '' },
    { supportRequired: 'NO', details: undefined },
    { supportRequired: 'YES', details: 'Chris will need passages of text read to him' },
  ])('happy path - validation passes - supportRequired: $supportRequired, details: $details', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(learningNeedsSupportPractitionerSupportSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { supportRequired: '', details: undefined },
    { supportRequired: undefined, details: undefined },
    { supportRequired: null, details: undefined },
    { supportRequired: 'a-non-supported-value', details: undefined },
    { supportRequired: 'N', details: undefined },
    { supportRequired: 'Y', details: undefined },
  ])(
    'sad path - validation of supportRequired field fails - supportRequired: $supportRequired, details: $details',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#supportRequired',
          text: 'Select whether any support from an LNSP is required',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(learningNeedsSupportPractitionerSupportSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/lnsp-support',
        expectedErrors,
      )
    },
  )

  it.each([
    { supportRequired: 'YES', details: '' },
    { supportRequired: 'YES', details: undefined },
    { supportRequired: 'YES', details: null },
  ])(
    'sad path - validation of details field fails - supportRequired: $supportRequired, details: $details',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [{ href: '#details', text: 'Enter details of any support required' }]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(learningNeedsSupportPractitionerSupportSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/lnsp-support',
        expectedErrors,
      )
    },
  )

  it('sad path - validation of details field length validation fails', async () => {
    // Given
    const requestBody = { supportRequired: 'YES', details: 'a'.repeat(4001) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      { href: '#details', text: 'Details of required support must be 4000 characters or less' },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(learningNeedsSupportPractitionerSupportSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/lnsp-support',
      expectedErrors,
    )
  })
})
