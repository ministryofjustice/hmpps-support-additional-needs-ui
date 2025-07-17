import { Request, Response } from 'express'
import { addDays, format, startOfToday, subDays } from 'date-fns'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import screenerDateSchema from './screenerDateSchema'

describe('screenerDateSchema', () => {
  const todayDate = startOfToday()
  const today = format(todayDate, 'd/M/yyyy')
  const tomorrowDate = addDays(todayDate, 1)
  const tomorrow = format(tomorrowDate, 'd/M/yyyy')
  const yesterdayDate = subDays(todayDate, 1)
  const yesterday = format(yesterdayDate, 'd/M/yyyy')

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
    req.originalUrl = '/aln-screener/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/screener-date'
  })

  it.each([{ screenerDate: today }, { screenerDate: yesterday }])(
    'happy path - validation passes - screenerDate: $screenerDate',
    async requestBody => {
      // Given
      req.body = requestBody

      // When
      await validate(screenerDateSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    { screenerDate: '' },
    { screenerDate: undefined },
    { screenerDate: null },
    { screenerDate: 'a-non-supported-value' },
  ])('sad path - validation of screenerDate field fails - screenerDate: $screenerDate', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#screenerDate',
        text: 'Enter a valid date',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(screenerDateSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/aln-screener/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/screener-date',
      expectedErrors,
    )
  })

  it('sad path - validation of screenerDate field fails due to being in the future', async () => {
    // Given
    const requestBody = { screenerDate: tomorrow }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#screenerDate',
        text: 'The screener date cannot be a future date',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(screenerDateSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/aln-screener/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/screener-date',
      expectedErrors,
    )
  })
})
