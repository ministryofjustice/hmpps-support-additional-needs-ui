import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import addStrengthsSchema from './addStrengthsSchema'
import { asArray } from '../../../utils/utils'

describe('addStrengthsSchema', () => {
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
    req.originalUrl = '/aln-screener/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/add-strengths'
  })

  it.each([
    { strengthTypeCodes: 'HANDWRITING' },
    { strengthTypeCodes: ['HANDWRITING'] },
    { strengthTypeCodes: ['HANDWRITING', 'NUMBER_RECALL', 'PEOPLE_PERSON'] },
  ])('happy path - validation passes - strengthTypeCodes: $strengthTypeCodes', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(addStrengthsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual({ ...requestBody, strengthTypeCodes: asArray(requestBody.strengthTypeCodes) })
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { strengthTypeCodes: '' },
    { strengthTypeCodes: undefined },
    { strengthTypeCodes: null },
    { strengthTypeCodes: 'a-non-supported-value' },
    { strengthTypeCodes: ['a-non-supported-value'] },
    { strengthTypeCodes: ['HANDWRITING', 'a-non-supported-value'] },
    { strengthTypeCodes: ['NONE', 'a-non-supported-value'] },
  ])(
    'sad path - validation of strengthTypeCodes field fails - strengthTypeCodes: $strengthTypeCodes',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#strengthTypeCodes',
          text: `Select all strengths that were identified on the screener, or select 'No strengths identified'`,
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(addStrengthsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/aln-screener/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/add-strengths',
        expectedErrors,
      )
    },
  )

  it('sad path - validation of strengthTypeCodes field fails - NONE must be the only option when specified', async () => {
    // Given
    const requestBody = { strengthTypeCodes: ['NONE', 'HANDWRITING'] }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#strengthTypeCodes',
        text: `It is not valid to select 1 or more strengths and 'No strengths identified'`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(addStrengthsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/aln-screener/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/add-strengths',
      expectedErrors,
    )
  })
})
