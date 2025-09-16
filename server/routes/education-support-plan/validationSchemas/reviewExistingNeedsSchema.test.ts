import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import reviewExistingNeedsSchema from './reviewExistingNeedsSchema'

describe('reviewExistingNeedsSchema', () => {
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
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/review-existing-needs'
  })

  it.each([
    { reviewBeforeCreatingPlan: 'NO' },
    { reviewBeforeCreatingPlan: 'NO' },
    { reviewBeforeCreatingPlan: 'YES' },
  ])('happy path - validation passes - reviewBeforeCreatingPlan: $reviewBeforeCreatingPlan', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(reviewExistingNeedsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { reviewBeforeCreatingPlan: '' },
    { reviewBeforeCreatingPlan: undefined },
    { reviewBeforeCreatingPlan: null },
    { reviewBeforeCreatingPlan: 'a-non-supported-value' },
    { reviewBeforeCreatingPlan: 'N' },
    { reviewBeforeCreatingPlan: 'Y' },
  ])(
    'sad path - validation of reviewBeforeCreatingPlan field fails - reviewBeforeCreatingPlan: $reviewBeforeCreatingPlan',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#reviewBeforeCreatingPlan',
          text: 'Select whether you would like to review strengths, challenges and support needs before creating the plan',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(reviewExistingNeedsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/review-existing-needs',
        expectedErrors,
      )
    },
  )
})
