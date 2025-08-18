import { Request, Response } from 'express'
import { validate } from '../../../middleware/validationMiddleware'
import type { Error } from '../../../filters/findErrorFilter'
import selectCategorySchema from './selectCategorySchema'

describe('selectCategorySchema', () => {
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
    req.originalUrl = '/support-strategies/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/select-category'
  })

  it.each([
    { category: 'SENSORY' },
    { category: 'EMOTIONS_FEELINGS_DEFAULT' },
    { category: 'PHYSICAL_SKILLS_DEFAULT' },
    { category: 'LITERACY_SKILLS_DEFAULT' },
    { category: 'NUMERACY_SKILLS_DEFAULT' },
    { category: 'ATTENTION_ORGANISING_TIME_DEFAULT' },
    { category: 'LANGUAGE_COMM_SKILLS_DEFAULT' },
    { category: 'PROCESSING_SPEED' },
    { category: 'MEMORY' },
    { category: 'GENERAL' },
  ])('happy path - validation passes - category: $category', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(selectCategorySchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    //
    { category: 'a-non-supported-value' },
    { category: null },
    { category: undefined },
    { category: '' },
  ])('sad path - category field validation fails - %s', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#category',
        text: 'Select a category',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(selectCategorySchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/support-strategies/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/select-category',
      expectedErrors,
    )
  })
})
