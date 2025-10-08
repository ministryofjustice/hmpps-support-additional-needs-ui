import { Request, Response } from 'express'
import { validate } from '../../../middleware/validationMiddleware'
import reviewersViewOnProgressSchema from './reviewersViewOnProgressSchema'
import type { Error } from '../../../filters/findErrorFilter'

describe('reviewersViewOnProgressSchema', () => {
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
      '/education-support-plan/A1234BC/review/61375886-8ec3-4ed4-a017-a0525817f14a/reviewers-view-on-progress'
  })

  it('happy path - validation passes with reviewers view on progress', async () => {
    // Given
    const requestBody = { reviewersViewOnProgress: 'Chris has made excellent progress' }
    req.body = requestBody

    // When
    await validate(reviewersViewOnProgressSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it('sad path - validation of reviewersViewOnProgress field length validation fails', async () => {
    // Given
    const requestBody = { reviewersViewOnProgress: 'a'.repeat(4001) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#reviewersViewOnProgress',
        text: `The reviewer's view on the person's progress must be 4000 characters or less`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(reviewersViewOnProgressSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/review/61375886-8ec3-4ed4-a017-a0525817f14a/reviewers-view-on-progress',
      expectedErrors,
    )
  })

  it('sad path - validation that reviewersViewOnProgress is present fails', async () => {
    // Given
    const requestBody = {}
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#reviewersViewOnProgress',
        text: `Enter reviewer's view on person's progress`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(reviewersViewOnProgressSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/review/61375886-8ec3-4ed4-a017-a0525817f14a/reviewers-view-on-progress',
      expectedErrors,
    )
  })

  it('sad path - validation that reviewersViewOnProgress is more than 1 character', async () => {
    // Given
    const requestBody = { reviewersViewOnProgress: '  ' }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#reviewersViewOnProgress',
        text: `Enter reviewer's view on person's progress`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(reviewersViewOnProgressSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/review/61375886-8ec3-4ed4-a017-a0525817f14a/reviewers-view-on-progress',
      expectedErrors,
    )
  })
})
