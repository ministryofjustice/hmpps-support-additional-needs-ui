import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import specificTeachingSkillsSchema from './specificTeachingSkillsSchema'

describe('specificTeachingSkillsSchema', () => {
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
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/specific-teaching-skills'
  })

  it.each([
    { skillsRequired: 'NO', details: '' },
    { skillsRequired: 'NO', details: undefined },
    { skillsRequired: 'YES', details: 'Adopt a more inclusive approach to teaching' },
  ])('happy path - validation passes - skillsRequired: $skillsRequired, details: $details', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(specificTeachingSkillsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { skillsRequired: '', details: undefined },
    { skillsRequired: undefined, details: undefined },
    { skillsRequired: null, details: undefined },
    { skillsRequired: 'a-non-supported-value', details: undefined },
    { skillsRequired: 'N', details: undefined },
    { skillsRequired: 'Y', details: undefined },
  ])(
    'sad path - validation of skillsRequired field fails - skillsRequired: $skillsRequired, details: $details',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#skillsRequired',
          text: 'Select whether any specific teaching skills are required',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(specificTeachingSkillsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/specific-teaching-skills',
        expectedErrors,
      )
    },
  )

  it.each([
    { skillsRequired: 'YES', details: '' },
    { skillsRequired: 'YES', details: undefined },
    { skillsRequired: 'YES', details: null },
  ])(
    'sad path - validation of details field fails - skillsRequired: $skillsRequired, details: $details',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [{ href: '#details', text: 'Enter details of any specific teaching skills' }]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(specificTeachingSkillsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/specific-teaching-skills',
        expectedErrors,
      )
    },
  )
})
