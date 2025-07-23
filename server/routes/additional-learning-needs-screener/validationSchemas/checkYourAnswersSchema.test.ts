import { Request, Response } from 'express'
import { validate } from '../../../middleware/validationMiddleware'
import checkYourAnswersSchema from './checkYourAnswersSchema'
import type { Error } from '../../../filters/findErrorFilter'

describe('checkYourAnswersSchema', () => {
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
    req.originalUrl = '/aln-screener/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/check-your-answers'
  })

  it.each([
    //
    { screenerInformationIsCorrect: true },
    { screenerInformationIsCorrect: 'true' },
    { screenerInformationIsCorrect: 'TRUE' },
  ])(
    'happy path - validation passes - screenerInformationIsCorrect: $screenerInformationIsCorrect',
    async requestBody => {
      // Given
      req.body = requestBody

      // When
      await validate(checkYourAnswersSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    //
    { screenerInformationIsCorrect: false },
    { screenerInformationIsCorrect: 'false' },
    { screenerInformationIsCorrect: 'something else' },
    { screenerInformationIsCorrect: '' },
    { screenerInformationIsCorrect: null },
    { screenerInformationIsCorrect: undefined },
    { screenerInformationIsCorrect: 1 },
  ])(
    'sad path - validation of screenerInformationIsCorrect field fails - screenerInformationIsCorrect: $screenerInformationIsCorrect',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#screenerInformationIsCorrect',
          text: 'You must confirm that the screener information is correct',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(checkYourAnswersSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/aln-screener/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/check-your-answers',
        expectedErrors,
      )
    },
  )
})
