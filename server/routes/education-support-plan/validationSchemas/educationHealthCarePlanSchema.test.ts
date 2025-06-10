import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import educationHealthCarePlanSchema from './educationHealthCarePlanSchema'

describe('educationHealthCarePlanSchema', () => {
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
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/education-health-care-plan'
  })

  it.each([{ hasCurrentEhcp: 'NO' }, { hasCurrentEhcp: 'NO' }, { hasCurrentEhcp: 'YES' }])(
    'happy path - validation passes - hasCurrentEhcp: $hasCurrentEhcp',
    async requestBody => {
      // Given
      req.body = requestBody

      // When
      await validate(educationHealthCarePlanSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    { hasCurrentEhcp: '' },
    { hasCurrentEhcp: undefined },
    { hasCurrentEhcp: null },
    { hasCurrentEhcp: 'a-non-supported-value' },
    { hasCurrentEhcp: 'N' },
    { hasCurrentEhcp: 'Y' },
  ])('sad path - validation of hasCurrentEhcp field fails - hasCurrentEhcp: $hasCurrentEhcp', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#hasCurrentEhcp',
        text: 'Select whether there is a current EHCP in place',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(educationHealthCarePlanSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/education-health-care-plan',
      expectedErrors,
    )
  })
})
