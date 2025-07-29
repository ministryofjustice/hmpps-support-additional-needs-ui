import { Request, Response } from 'express'
import { validate } from '../../../middleware/validationMiddleware'
import detailsSchema from './detailsSchema'
import type { Error } from '../../../filters/findErrorFilter'

describe('detailsSchema', () => {
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
    req.originalUrl = '/conditions/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/details'
  })

  it.each([
    {
      conditionDetails: { ADHD: 'Details for ADHD' },
    },
    {
      conditionDetails: { LONG_TERM_OTHER: 'Details for LONG_TERM_OTHER', VISUAL_IMPAIR: 'Details for VISUAL_IMPAIR' },
    },
  ])('happy path - validation passes - conditionDetails: $conditionDetails', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(detailsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    {
      conditionDetails: null,
    },
    {
      conditionDetails: undefined,
    },
    {
      conditionDetails: '',
    },
    {
      conditionDetails: {},
    },
    {
      conditionDetails: { NOT_A_VALID_CONDITION: 'Details for NOT_A_VALID_CONDITION' },
    },
  ])(
    'sad path - validation of conditionDetails field fails - conditionDetails: $conditionDetails',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#conditionDetails',
          text: 'Enter details of the conditions',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(detailsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/conditions/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/details',
        expectedErrors,
      )
    },
  )

  it.each([
    {
      conditionDetails: { ADHD: '' },
    },
    {
      conditionDetails: { ADHD: '   ' },
    },
    {
      conditionDetails: {
        ADHD: `

      `,
      },
    },
  ])(
    'sad path - validation of individual conditionDetails field fails - conditionDetails: $conditionDetails',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#ADHD_details',
          text: 'Enter details of the condition',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(detailsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/conditions/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/details',
        expectedErrors,
      )
    },
  )

  it('sad path - validation of individual conditionDetails field fails max length', async () => {
    // Given
    const requestBody = { conditionDetails: { ADHD: 'a'.repeat(4001) } }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#ADHD_details',
        text: 'The condition detail must be 4000 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(detailsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/conditions/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/details',
      expectedErrors,
    )
  })

  it('sad path - validation of individual conditionDetails fields fails', async () => {
    // Given
    const requestBody = {
      conditionDetails: {
        ADHD: 'This value is OK',
        OTHER: 'a'.repeat(4001),
        TOURETTES: 'This value is OK',
        NEURODEGEN: '',
        PHYSICAL_OTHER: 'a'.repeat(4001),
        DYSCALCULIA: 'This value is OK',
      },
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#NEURODEGEN_details',
        text: 'Enter details of the condition',
      },
      {
        href: '#PHYSICAL_OTHER_details',
        text: 'The condition detail must be 4000 characters or less',
      },
      {
        href: '#OTHER_details',
        text: 'The condition detail must be 4000 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(detailsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/conditions/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/details',
      expectedErrors,
    )
  })
})
