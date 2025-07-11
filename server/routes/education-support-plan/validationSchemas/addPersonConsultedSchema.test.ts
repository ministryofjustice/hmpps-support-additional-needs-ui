import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import addPersonConsultedSchema from './addPersonConsultedSchema'
import { validate } from '../../../middleware/validationMiddleware'

describe('addPersonConsultedSchema', () => {
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
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/other-people-consulted/add-person'
  })

  it('happy path - validation passes', async () => {
    // Given
    const requestBody = { fullName: 'A Person' }
    req.body = requestBody

    // When
    await validate(addPersonConsultedSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    //
    { fullName: null },
    { fullName: undefined },
    { fullName: '' },
    { fullName: ' ' },
    {
      fullName: `

    `,
    },
  ])('sad path - fullName field validation fails - %s', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#fullName',
        text: 'Enter the full name of the person was was consulted or involved in the creation of the plan',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(addPersonConsultedSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/other-people-consulted/add-person',
      expectedErrors,
    )
  })

  it('sad path - fullName field length validation fails', async () => {
    // Given
    const requestBody = {
      fullName: 'a'.repeat(201),
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#fullName',
        text: 'Full name must be 200 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(addPersonConsultedSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/other-people-consulted/add-person',
      expectedErrors,
    )
  })
})
