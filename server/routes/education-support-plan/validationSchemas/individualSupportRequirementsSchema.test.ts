import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import individualSupportRequirementsSchema from './individualSupportRequirementsSchema'

describe('individualSupportRequirementsSchema', () => {
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
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/individual-support-requirements'
  })

  it('happy path - validation passes', async () => {
    // Given
    const requestBody = { supportRequirements: 'Some support requirements that the individual feels they need' }
    req.body = requestBody

    // When
    await validate(individualSupportRequirementsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { supportRequirements: null },
    { supportRequirements: undefined },
    { supportRequirements: '' },
    { supportRequirements: '   ' },
    {
      supportRequirements: `

  `,
    },
  ])('sad path - validation false - supportRequirements: supportRequirements', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#supportRequirements',
        text: 'Enter details of any support requirements that the individual feels they need',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(individualSupportRequirementsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/individual-support-requirements',
      expectedErrors,
    )
  })

  it('sad path - validation of supportRequirements field length validation fails', async () => {
    // Given
    const requestBody = { supportRequirements: 'a'.repeat(4001) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#supportRequirements',
        text: 'Any support requirements that the individual feels they need must be 4000 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(individualSupportRequirementsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/individual-support-requirements',
      expectedErrors,
    )
  })
})
