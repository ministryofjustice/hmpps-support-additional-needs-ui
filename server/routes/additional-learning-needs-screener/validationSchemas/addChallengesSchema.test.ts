import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import addChallengesSchema from './addChallengesSchema'
import { asArray } from '../../../utils/utils'

describe('addChallengesSchema', () => {
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
    req.originalUrl = '/aln-screener/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/add-challenges'
  })

  it.each([
    { challengeTypeCodes: 'HANDWRITING' },
    { challengeTypeCodes: ['HANDWRITING'] },
    { challengeTypeCodes: ['HANDWRITING', 'NUMBER_RECALL', 'PEOPLE_PERSON'] },
  ])('happy path - validation passes - challengeTypeCodes: $challengeTypeCodes', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(addChallengesSchema)(req, res, next)

    // Then
    expect(req.body).toEqual({ ...requestBody, challengeTypeCodes: asArray(requestBody.challengeTypeCodes) })
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { challengeTypeCodes: '' },
    { challengeTypeCodes: undefined },
    { challengeTypeCodes: null },
    { challengeTypeCodes: 'a-non-supported-value' },
    { challengeTypeCodes: ['a-non-supported-value'] },
    { challengeTypeCodes: ['HANDWRITING', 'a-non-supported-value'] },
    { challengeTypeCodes: ['NONE', 'a-non-supported-value'] },
  ])(
    'sad path - validation of challengeTypeCodes field fails - challengeTypeCodes: $challengeTypeCodes',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#challengeTypeCodes',
          text: `Select all challenges that were identified on the screener, or select 'No challenges identified'`,
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(addChallengesSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/aln-screener/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/add-challenges',
        expectedErrors,
      )
    },
  )

  it('sad path - validation of challengeTypeCodes field fails - NONE must be the only option when specified', async () => {
    // Given
    const requestBody = { challengeTypeCodes: ['NONE', 'HANDWRITING'] }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#challengeTypeCodes',
        text: `It is not valid to select 1 or more challenges and 'No challenges identified'`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(addChallengesSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/aln-screener/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/add-challenges',
      expectedErrors,
    )
  })
})
