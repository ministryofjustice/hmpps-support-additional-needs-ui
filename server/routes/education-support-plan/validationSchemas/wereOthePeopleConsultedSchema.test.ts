import { Request, Response } from 'express'
import type { Error } from '../../../filters/findErrorFilter'
import { validate } from '../../../middleware/validationMiddleware'
import wereOtherPeopleConsultedSchema from './wereOtherPeopleConsultedSchema'

describe('wereOtherPeopleConsultedSchema', () => {
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
      '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/education-health-care-plan'
  })

  it.each([
    { wereOtherPeopleConsulted: 'NO' },
    { wereOtherPeopleConsulted: 'NO' },
    { wereOtherPeopleConsulted: 'YES' },
  ])('happy path - validation passes - wereOtherPeopleConsulted: $wereOtherPeopleConsulted', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(wereOtherPeopleConsultedSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { wereOtherPeopleConsulted: '' },
    { wereOtherPeopleConsulted: undefined },
    { wereOtherPeopleConsulted: null },
    { wereOtherPeopleConsulted: 'a-non-supported-value' },
    { wereOtherPeopleConsulted: 'N' },
    { wereOtherPeopleConsulted: 'Y' },
  ])(
    'sad path - validation of wereOtherPeopleConsulted field fails - wereOtherPeopleConsulted: $wereOtherPeopleConsulted',
    async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#wereOtherPeopleConsulted',
          text: 'Select whether other people where consulted in the creation of the plan',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(wereOtherPeopleConsultedSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/education-health-care-plan',
        expectedErrors,
      )
    },
  )
})
