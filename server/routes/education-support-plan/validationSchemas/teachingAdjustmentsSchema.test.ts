import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import teachingAdjustmentsSchema from './teachingAdjustmentsSchema'

describe('teachingAdjustmentsSchema', () => {
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
    req.originalUrl = '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/teaching-adjustments'
  })

  it.each([
    { adjustmentsNeeded: 'NO', details: '' },
    { adjustmentsNeeded: 'NO', details: undefined },
    { adjustmentsNeeded: 'YES', details: 'Use simpler examples to explain the concepts of the subject' },
  ])('happy path - validation passes - adjustmentsNeeded: $adjustmentsNeeded, details: $details', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(teachingAdjustmentsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { adjustmentsNeeded: '', details: undefined },
    { adjustmentsNeeded: undefined, details: undefined },
    { adjustmentsNeeded: null, details: undefined },
    { adjustmentsNeeded: 'a-non-supported-value', details: undefined },
    { adjustmentsNeeded: 'N', details: undefined },
    { adjustmentsNeeded: 'Y', details: undefined },
  ])(
    'sad path - validation of adjustmentsNeeded field fails - adjustmentsNeeded: $adjustmentsNeeded, details: $details',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#adjustmentsNeeded',
          text: 'Select whether any adjustments are required to the teaching',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(teachingAdjustmentsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/teaching-adjustments',
        expectedErrors,
      )
    },
  )

  it.each([
    { adjustmentsNeeded: 'YES', details: '' },
    { adjustmentsNeeded: 'YES', details: undefined },
    { adjustmentsNeeded: 'YES', details: null },
  ])(
    'sad path - validation of details field fails - adjustmentsNeeded: $adjustmentsNeeded, details: $details',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        { href: '#details', text: 'Enter details of any adjustments to the teaching' },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(teachingAdjustmentsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/teaching-adjustments',
        expectedErrors,
      )
    },
  )

  it('sad path - validation of details field length validation fails', async () => {
    // Given
    const requestBody = { adjustmentsNeeded: 'YES', details: 'a'.repeat(4001) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      { href: '#details', text: 'Details of adjustments to the teaching must be 4000 characters or less' },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(teachingAdjustmentsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/teaching-adjustments',
      expectedErrors,
    )
  })
})
