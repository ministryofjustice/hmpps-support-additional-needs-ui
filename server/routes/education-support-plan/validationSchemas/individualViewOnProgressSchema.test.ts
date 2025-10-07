import { Request, Response } from 'express'
import { validate } from '../../../middleware/validationMiddleware'
import individualViewOnProgressSchema from './individualViewOnProgressSchema'
import type { Error } from '../../../filters/findErrorFilter'

describe('individualViewOnProgressSchema', () => {
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
      '/education-support-plan/A1234BC/review/61375886-8ec3-4ed4-a017-a0525817f14a/individual-view-on-progress'
  })

  it('happy path - validation passes with prisoner view on progress', async () => {
    // Given
    const requestBody = { prisonerViewOnProgress: 'Chris is happy with his progress' }
    req.body = requestBody

    // When
    await validate(individualViewOnProgressSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it('happy path - validation passes with prisoner refusing to take part', async () => {
    // Given
    const requestBody = { prisonerDeclinedBeingPartOfReview: true }
    req.body = requestBody

    // When
    await validate(individualViewOnProgressSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it('sad path - validation of prisonerViewOnProgress field length validation fails', async () => {
    // Given
    const requestBody = { prisonerViewOnProgress: 'a'.repeat(4001) }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#prisonerViewOnProgress',
        text: `The individual's view on their progress must be 4000 characters or less`,
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(individualViewOnProgressSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/review/61375886-8ec3-4ed4-a017-a0525817f14a/individual-view-on-progress',
      expectedErrors,
    )
  })

  it('sad path - validation that either prisonerViewOnProgress or prisonerDeclinedBeingPartOfReview are present fails', async () => {
    // Given
    const requestBody = {}
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#prisonerViewOnProgress',
        text: 'Enter details of how person feels about progress or select if review declined',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(individualViewOnProgressSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/review/61375886-8ec3-4ed4-a017-a0525817f14a/individual-view-on-progress',
      expectedErrors,
    )
  })

  it('sad path - validation that either prisonerViewOnProgress or prisonerDeclinedBeingPartOfReview are present fails', async () => {
    // Given
    const requestBody = {
      prisonerViewOnProgress: 'Chris is happy with his progress',
      prisonerDeclinedBeingPartOfReview: true,
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#prisonerViewOnProgress',
        text: 'You cannot enter progress details and select the declined review box. Complete one option only.',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(individualViewOnProgressSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/education-support-plan/A1234BC/review/61375886-8ec3-4ed4-a017-a0525817f14a/individual-view-on-progress',
      expectedErrors,
    )
  })
})
