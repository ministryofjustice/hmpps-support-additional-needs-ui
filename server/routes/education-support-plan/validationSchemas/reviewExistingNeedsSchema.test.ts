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
    //
    { reviewExistingNeeds: 'NO' },
    { reviewExistingNeeds: 'NO' },
    { reviewExistingNeeds: 'YES' },
  ])('happy path - validation passes - reviewExistingNeeds: $reviewExistingNeeds', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(reviewExistingNeedsSchema())(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { reviewExistingNeeds: '' },
    { reviewExistingNeeds: undefined },
    { reviewExistingNeeds: null },
    { reviewExistingNeeds: 'a-non-supported-value' },
    { reviewExistingNeeds: 'N' },
    { reviewExistingNeeds: 'Y' },
  ])(
    'sad path - validation of reviewExistingNeeds field fails in create journey - reviewExistingNeeds: $reviewExistingNeeds',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#reviewExistingNeeds',
          text: 'Select whether you would like to review strengths, challenges and support needs before creating the plan',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(reviewExistingNeedsSchema({ journey: 'create' }))(req, res, next)

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

  it.each([
    { reviewExistingNeeds: '' },
    { reviewExistingNeeds: undefined },
    { reviewExistingNeeds: null },
    { reviewExistingNeeds: 'a-non-supported-value' },
    { reviewExistingNeeds: 'N' },
    { reviewExistingNeeds: 'Y' },
  ])(
    'sad path - validation of reviewExistingNeeds field fails in review journey - reviewExistingNeeds: $reviewExistingNeeds',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#reviewExistingNeeds',
          text: 'Select if you want to review challenges, strengths, conditions and support strategies before reviewing the education support plan',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(reviewExistingNeedsSchema({ journey: 'review' }))(req, res, next)

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
