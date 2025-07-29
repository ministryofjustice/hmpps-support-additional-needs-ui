import { Request, Response } from 'express'
import { validate } from '../../../middleware/validationMiddleware'
import selectConditionsSchema from './selectConditionsSchema'
import { asArray } from '../../../utils/utils'
import type { Error } from '../../../filters/findErrorFilter'

describe('selectConditionsSchema', () => {
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
    req.originalUrl = '/conditions/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/select-conditions'
  })

  it.each([
    { conditions: 'ADHD', conditionNames: undefined },
    { conditions: ['ADHD'], conditionNames: undefined },
    { conditions: ['ADHD', 'DYSLEXIA', 'TOURETTES'], conditionNames: undefined },
    {
      conditions: ['ADHD', 'VISUAL_IMPAIR', 'DYSLEXIA', 'LONG_TERM_OTHER', 'TOURETTES'],
      conditionNames: { LONG_TERM_OTHER: 'Names for LONG_TERM_OTHER', VISUAL_IMPAIR: 'Names for VISUAL_IMPAIR' },
    },
  ])('happy path - validation passes - conditions: $conditions, conditionNames: $conditionNames', async requestBody => {
    // Given
    req.body = requestBody

    // When
    await validate(selectConditionsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual({ ...requestBody, conditions: asArray(requestBody.conditions) })
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  it.each([
    { conditions: '' },
    { conditions: undefined },
    { conditions: null },
    { conditions: 'a-non-supported-value' },
    { conditions: ['a-non-supported-value'] },
    { conditions: ['TOURETTES', 'a-non-supported-value'] },
  ])('sad path - validation of conditions field fails - conditions: $conditions', async requestBody => {
    // Given
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#conditions',
        text: 'Select all conditions that the person has',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(selectConditionsSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/conditions/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/select-conditions',
      expectedErrors,
    )
  })

  it.each([
    { conditions: ['LD_OTHER'] },
    { conditions: ['LD_OTHER'], conditionNames: {} },
    { conditions: ['LD_OTHER'], conditionNames: { LD_OTHER: '' } },
    { conditions: ['LD_OTHER'], conditionNames: { LD_OTHER: '  ' } },
    { conditions: ['MENTAL_HEALTH'] },
    { conditions: ['MENTAL_HEALTH'], conditionNames: {} },
    { conditions: ['MENTAL_HEALTH'], conditionNames: { MENTAL_HEALTH: '' } },
    { conditions: ['MENTAL_HEALTH'], conditionNames: { MENTAL_HEALTH: '  ' } },
    { conditions: ['NEURODEGEN'] },
    { conditions: ['NEURODEGEN'], conditionNames: {} },
    { conditions: ['NEURODEGEN'], conditionNames: { NEURODEGEN: '' } },
    { conditions: ['NEURODEGEN'], conditionNames: { NEURODEGEN: '  ' } },
    { conditions: ['PHYSICAL_OTHER'] },
    { conditions: ['PHYSICAL_OTHER'], conditionNames: {} },
    { conditions: ['PHYSICAL_OTHER'], conditionNames: { PHYSICAL_OTHER: '' } },
    { conditions: ['PHYSICAL_OTHER'], conditionNames: { PHYSICAL_OTHER: '  ' } },
    { conditions: ['VISUAL_IMPAIR'] },
    { conditions: ['VISUAL_IMPAIR'], conditionNames: {} },
    { conditions: ['VISUAL_IMPAIR'], conditionNames: { VISUAL_IMPAIR: '' } },
    { conditions: ['VISUAL_IMPAIR'], conditionNames: { VISUAL_IMPAIR: '  ' } },
    { conditions: ['OTHER'] },
    { conditions: ['OTHER'], conditionNames: {} },
    { conditions: ['OTHER'], conditionNames: { OTHER: '' } },
    { conditions: ['OTHER'], conditionNames: { OTHER: '  ' } },
    { conditions: ['DLD_OTHER'] },
    { conditions: ['DLD_OTHER'], conditionNames: {} },
    { conditions: ['DLD_OTHER'], conditionNames: { DLD_OTHER: '' } },
    { conditions: ['DLD_OTHER'], conditionNames: { DLD_OTHER: '  ' } },
    { conditions: ['LEARN_DIFF_OTHER'] },
    { conditions: ['LEARN_DIFF_OTHER'], conditionNames: {} },
    { conditions: ['LEARN_DIFF_OTHER'], conditionNames: { LEARN_DIFF_OTHER: '' } },
    { conditions: ['LEARN_DIFF_OTHER'], conditionNames: { LEARN_DIFF_OTHER: '  ' } },
    { conditions: ['LONG_TERM_OTHER'] },
    { conditions: ['LONG_TERM_OTHER'], conditionNames: {} },
    { conditions: ['LONG_TERM_OTHER'], conditionNames: { LONG_TERM_OTHER: '' } },
    { conditions: ['LONG_TERM_OTHER'], conditionNames: { LONG_TERM_OTHER: '  ' } },
    { conditions: ['NEURO_OTHER'] },
    { conditions: ['NEURO_OTHER'], conditionNames: {} },
    { conditions: ['NEURO_OTHER'], conditionNames: { NEURO_OTHER: '' } },
    { conditions: ['NEURO_OTHER'], conditionNames: { NEURO_OTHER: '  ' } },
  ])(
    'sad path - validation of conditional detail field fails due to missing names - conditions: $conditions, conditionNames: $conditionNames',
    async requestBody => {
      const conditionType = requestBody.conditions[0]
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: `#${conditionType}_conditionNames`,
          text: 'Specify the condition',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(selectConditionsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/conditions/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/select-conditions',
        expectedErrors,
      )
    },
  )

  it.each([
    { conditions: ['LD_OTHER'], conditionNames: { LD_OTHER: 'a'.repeat(201) } },
    { conditions: ['MENTAL_HEALTH'], conditionNames: { MENTAL_HEALTH: 'a'.repeat(201) } },
    { conditions: ['NEURODEGEN'], conditionNames: { NEURODEGEN: 'a'.repeat(201) } },
    { conditions: ['PHYSICAL_OTHER'], conditionNames: { PHYSICAL_OTHER: 'a'.repeat(201) } },
    { conditions: ['VISUAL_IMPAIR'], conditionNames: { VISUAL_IMPAIR: 'a'.repeat(201) } },
    { conditions: ['OTHER'], conditionNames: { OTHER: 'a'.repeat(201) } },
    { conditions: ['DLD_OTHER'], conditionNames: { DLD_OTHER: 'a'.repeat(201) } },
    { conditions: ['LEARN_DIFF_OTHER'], conditionNames: { LEARN_DIFF_OTHER: 'a'.repeat(201) } },
    { conditions: ['LONG_TERM_OTHER'], conditionNames: { LONG_TERM_OTHER: 'a'.repeat(201) } },
    { conditions: ['NEURO_OTHER'], conditionNames: { NEURO_OTHER: 'a'.repeat(201) } },
  ])(
    'sad path - validation of conditional detail field length validation fails - conditions: $conditions, conditionNames: $conditionNames',
    async requestBody => {
      const conditionType = requestBody.conditions[0]
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: `#${conditionType}_conditionNames`,
          text: 'Condition name must be 200 characters or less',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(selectConditionsSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/conditions/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/select-conditions',
        expectedErrors,
      )
    },
  )
})
