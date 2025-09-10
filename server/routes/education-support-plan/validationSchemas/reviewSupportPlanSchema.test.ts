import { Request, Response } from 'express'
import { addDays, addMonths, format, startOfToday, subDays } from 'date-fns'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import reviewSupportPlanSchema from './reviewSupportPlanSchema'

describe('reviewSupportPlanSchema', () => {
  const todayDate = startOfToday()
  const today = format(todayDate, 'd/M/yyyy')
  const threeMonthsAfterTodayDate = addMonths(todayDate, 3)
  const threeMonthsAfterToday = format(threeMonthsAfterTodayDate, 'd/M/yyyy')
  const yesterdayDate = subDays(todayDate, 1)
  const yesterday = format(yesterdayDate, 'd/M/yyyy')
  const threeMonthsAndOneDayAfterTodayDate = addDays(threeMonthsAfterTodayDate, 1)
  const threeMonthsAndOneDayAfterToday = format(threeMonthsAndOneDayAfterTodayDate, 'd/M/yyyy')

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
    req.originalUrl = '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/next-review-date'
  })

  it.each([{ reviewDate: today }, { reviewDate: threeMonthsAfterToday }])(
    'happy path - validation passes - reviewDate: $reviewDate',
    async requestBody => {
      // Given
      req.body = requestBody

      // When
      await validate(reviewSupportPlanSchema)(req, res, next)

      // Temporary block on review dates being set in Oct 2025 would cause this test to fail when it's run in october
      // TODO: Remove this once October 2025 has passed
      if (todayDate.getMonth() === 9 && todayDate.getFullYear() === 2025) {
        // Then
        const expectedErrors: Array<Error> = [
          {
            href: '#reviewDate',
            text: 'Review date cannot be in October 2025',
          },
        ]
        const expectedInvalidForm = JSON.stringify(requestBody)
        expect(req.body).toEqual(requestBody)
        expect(next).not.toHaveBeenCalled()
        expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
        expect(res.redirectWithErrors).toHaveBeenCalledWith(
          '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/next-review-date',
          expectedErrors,
        )
      } else {
        // Then
        expect(req.body).toEqual(requestBody)
        expect(next).toHaveBeenCalled()
        expect(req.flash).not.toHaveBeenCalled()
        expect(res.redirectWithErrors).not.toHaveBeenCalled()
      }
    },
  )

  it.each([
    { reviewDate: '' },
    { reviewDate: undefined },
    { reviewDate: null },
    { reviewDate: 'a-non-supported-value' },
  ])('sad path - validation of reviewDate field fails - reviewDate: $reviewDate', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#reviewDate',
        text: 'Enter a valid date',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(reviewSupportPlanSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/next-review-date',
      expectedErrors,
    )
  })

  it.each([{ reviewDate: '01/10/2025' }, { reviewDate: '31/10/2025' }])(
    'sad path - validation of reviewDate field fails due to being within October 2025  - reviewDate: $reviewDate',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#reviewDate',
          text: 'Review date cannot be in October 2025',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(reviewSupportPlanSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/next-review-date',
        expectedErrors,
      )
    },
  )

  it.each([{ reviewDate: yesterday }, { reviewDate: threeMonthsAndOneDayAfterToday }])(
    'sad path - validation of reviewDate field fails due to being outside of range - reviewDate: $reviewDate',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#reviewDate',
          text: 'Enter a review date within the next 3 months',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(reviewSupportPlanSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/next-review-date',
        expectedErrors,
      )
    },
  )
})
