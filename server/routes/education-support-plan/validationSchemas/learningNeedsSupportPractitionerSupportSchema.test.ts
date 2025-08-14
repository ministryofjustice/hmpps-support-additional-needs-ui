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
    { supportRequired: 'NO', details: '', supportHours: null },
    { supportRequired: 'NO', details: undefined, supportHours: null },
    { supportRequired: 'YES', details: 'Chris will need passages of text read to him', supportHours: '10' },
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
    { supportRequired: 'YES', details: '', supportHours: '10' },
    { supportRequired: 'YES', details: undefined, supportHours: '10' },
    { supportRequired: 'YES', details: null, supportHours: '10' },
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

  it.each([
    { supportRequired: 'YES', details: 'Some support is required', supportHours: null },
    { supportRequired: 'YES', details: 'Some support is required', supportHours: undefined },
    { supportRequired: 'YES', details: 'Some support is required', supportHours: '-1' },
    { supportRequired: 'YES', details: 'Some support is required', supportHours: 'two' },
  ])(
    'sad path - validation of supportHours field fails - supportRequired: $supportRequired, supportHours: $supportHours',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        { href: '#supportHours', text: 'You must enter a number of hours of support even if that number is 0' },
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

  it('sad path - validation of details field length validation fails', async () => {
    // Given
    const requestBody = { supportRequired: 'YES', details: 'a'.repeat(4001), supportHours: '10' }
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

  it('sad path - validation of both details and supportHours fields fails', async () => {
    // Given
    const requestBody = { supportRequired: 'YES', details: '', supportHours: '-1' }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      { href: '#details', text: 'Enter details of any support required' },
      { href: '#supportHours', text: 'You must enter a number of hours of support even if that number is 0' },
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
