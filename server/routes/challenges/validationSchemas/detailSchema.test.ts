import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import detailSchema from './detailSchema'
import { asArray } from '../../../utils/utils'

describe('detailSchema', () => {
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
    req.originalUrl = '/strengths/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/detail'
  })

  it.each([
    {
      description: `A description of the person's strength`,
      howIdentified: ['EDUCATION_SKILLS_WORK'],
      howIdentifiedOther: undefined,
    },
    {
      description: `A description of the person's strength`,
      howIdentified: ['EDUCATION_SKILLS_WORK', 'WIDER_PRISON'],
      howIdentifiedOther: undefined,
    },
    {
      description: `A description of the person's strength`,
      howIdentified: ['OTHER'],
      howIdentifiedOther: 'Some other identification',
    },
    {
      description: `A description of the person's strength`,
      howIdentified: ['EDUCATION_SKILLS_WORK', 'OTHER'],
      howIdentifiedOther: 'Some other identification',
    },
    {
      description: `A description of the person's strength`,
      howIdentified: 'EDUCATION_SKILLS_WORK', // single values are parsed by express as a string rather than an array
      howIdentifiedOther: 'Some other identification',
    },
  ])('happy path - validation passes - %s', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(detailSchema)(req, res, next)

    // Then
    expect(req.body).toEqual({ ...requestBody, howIdentified: asArray(requestBody.howIdentified) })
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    //
    null,
    undefined,
    '',
    ' ',
    `

    `,
  ])('sad path - description field validation fails - %s', async description => {
    // Given
    const requestBody = {
      description,
      howIdentified: ['EDUCATION_SKILLS_WORK'],
      howIdentifiedOther: undefined as string,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#description',
        text: 'Enter a description of the strength',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(detailSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/strengths/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/detail',
      expectedErrors,
    )
  })

  it('sad path - description field length validation fails', async () => {
    // Given
    const requestBody = {
      description: 'a'.repeat(4001),
      howIdentified: ['EDUCATION_SKILLS_WORK'],
      howIdentifiedOther: undefined as string,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#description',
        text: 'Description of the strength must be 4000 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(detailSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/strengths/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/detail',
      expectedErrors,
    )
  })

  it.each([
    'a-non-supported-value',
    null,
    undefined,
    '',
    [],
    ['EDUCATION_SKILLS_WORK', 'a-non-supported-value'],
    ['a-non-supported-value'],
    ['a-non-supported-value', null, undefined, ''],
  ])('sad path - howIdentified field validation fails - %s', async howIdentified => {
    // Given
    const requestBody = {
      description: `A description of the person's strength`,
      howIdentified,
      howIdentifiedOther: undefined as string,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#howIdentified',
        text: 'Select at least one option for how this strength was identified',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(detailSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/strengths/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/detail',
      expectedErrors,
    )
  })

  it.each([
    //
    null,
    undefined,
    '',
    ' ',
    `

    `,
  ])(
    'sad path - howIdentifiedOther field validation fails given howIdentified includes OTHER - %s',
    async howIdentifiedOther => {
      // Given
      const requestBody = {
        description: `A description of the person's strength`,
        howIdentified: ['OTHER'],
        howIdentifiedOther,
      }
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#howIdentifiedOther',
          text: 'Enter details of how this strength was identified',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(detailSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/strengths/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/detail',
        expectedErrors,
      )
    },
  )

  it('sad path - howIdentifiedOther field length validation fails', async () => {
    // Given
    const requestBody = {
      description: `A description of the person's strength`,
      howIdentified: ['OTHER'],
      howIdentifiedOther: 'a'.repeat(201),
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#howIdentifiedOther',
        text: 'How this strength was identified must be 200 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(detailSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/strengths/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/detail',
      expectedErrors,
    )
  })
})
