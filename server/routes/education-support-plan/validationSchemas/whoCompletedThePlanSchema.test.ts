import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import whoCompletedThePlanSchema from './whoCompletedThePlanSchema'
import { validate } from '../../../middleware/validationMiddleware'

describe('whoCompletedThePlanSchema', () => {
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
    req.originalUrl = '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/who-created-the-plan'
  })

  it.each([
    {
      completedBy: 'MYSELF',
      completedByOtherFullName: undefined,
      completedByOtherJobRole: undefined,
    },
    {
      completedBy: 'MYSELF',
      completedByOtherFullName: undefined,
      completedByOtherJobRole: undefined,
    },
    {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: 'Joe Bloggs',
      completedByOtherJobRole: 'Peer mentor',
    },
  ])(
    'happy path - validation passes - completedBy: $completedBy, completedByOtherFullName: $completedByOtherFullName, completedByOtherJobRole: $completedByOtherJobRole',
    async requestBody => {
      // Given
      req.body = requestBody

      // When
      await validate(whoCompletedThePlanSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    //
    { completedBy: 'a-non-supported-value' },
    { completedBy: null },
    { completedBy: undefined },
    { completedBy: '' },
  ])('sad path - completedBy field validation fails - %s', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedBy',
        text: 'Select whether you met with the person to create their plan',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedThePlanSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/who-created-the-plan',
      expectedErrors,
    )
  })

  it('sad path - mandatory completedByOtherFullName field validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: undefined as string,
      completedByOtherJobRole: 'Peer mentor',
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedByOtherFullName',
        text: 'Enter the full name of the person who met with the person to create their plan',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedThePlanSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/who-created-the-plan',
      expectedErrors,
    )
  })

  it('sad path - completedByOtherFullName field length validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: 'a'.repeat(201),
      completedByOtherJobRole: 'Peer mentor',
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedByOtherFullName',
        text: 'Full name must be 200 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedThePlanSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/who-created-the-plan',
      expectedErrors,
    )
  })

  it('sad path - mandatory completedByOtherJobRole field validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: 'Joe Bloggs',
      completedByOtherJobRole: undefined as string,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedByOtherJobRole',
        text: 'Enter the job title of the person who met with the person to create their plan',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedThePlanSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/who-created-the-plan',
      expectedErrors,
    )
  })

  it('sad path - completedByOtherJobRole field length validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: 'Joe Bloggs',
      completedByOtherJobRole: 'a'.repeat(201),
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedByOtherJobRole',
        text: 'Job role must be 200 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedThePlanSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/who-created-the-plan',
      expectedErrors,
    )
  })

  it('sad path - mandatory completedByOtherJobRole and completedByOtherFullName fields validation fails', async () => {
    // Given
    const requestBody = {
      completedBy: 'SOMEBODY_ELSE',
      completedByOtherFullName: undefined as string,
      completedByOtherJobRole: undefined as string,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#completedByOtherFullName',
        text: 'Enter the full name of the person who met with the person to create their plan',
      },
      {
        href: '#completedByOtherJobRole',
        text: 'Enter the job title of the person who met with the person to create their plan',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(whoCompletedThePlanSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/who-created-the-plan',
      expectedErrors,
    )
  })
})
