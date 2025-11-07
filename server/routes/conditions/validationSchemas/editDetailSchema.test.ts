import { Request, Response } from 'express'
import { validate } from '../../../middleware/validationMiddleware'
import editDetailSchema from './editDetailSchema'
import type { Error } from '../../../filters/findErrorFilter'
import { aValidConditionDto } from '../../../testsupport/conditionDtoTestDataBuilder'
import ConditionType from '../../../enums/conditionType'

describe('editDetailSchema', () => {
  const conditionDto = aValidConditionDto({ conditionTypeCode: ConditionType.OTHER })
  const req = {
    originalUrl: '',
    body: {},
    flash: jest.fn(),
    journeyData: { conditionDto },
  } as unknown as Request
  const res = {
    redirectWithErrors: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.originalUrl =
      '/conditions/A1234BC/f7dc617b-a6a8-42e7-ac0e-7d5a857f9b7d/edit/61375886-8ec3-4ed4-a017-a0525817f14a/detail'
    req.journeyData = { conditionDto }
  })

  it.each([
    ConditionType.ABI,
    ConditionType.ADHD,
    ConditionType.ASC,
    ConditionType.DLD_LANG,
    ConditionType.LD_DOWN,
    ConditionType.DYSCALCULIA,
    ConditionType.DYSLEXIA,
    ConditionType.DYSPRAXIA,
    ConditionType.FASD,
    ConditionType.DLD_HEAR,
    ConditionType.TOURETTES,
  ])(
    'happy path - validation passes given the Condition is of type %s and there is no condition name',
    async conditionType => {
      // Given
      req.journeyData.conditionDto = aValidConditionDto({ conditionTypeCode: conditionType })

      const requestBody = {
        conditionSource: 'SELF_DECLARED',
        conditionDetails: `Details for ${conditionType}`,
        conditionName: null as string,
      }
      req.body = requestBody

      // When
      await validate(editDetailSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    ConditionType.LD_OTHER,
    ConditionType.MENTAL_HEALTH,
    ConditionType.NEURODEGEN,
    ConditionType.PHYSICAL_OTHER,
    ConditionType.VISUAL_IMPAIR,
    ConditionType.OTHER,
    ConditionType.DLD_OTHER,
    ConditionType.LEARN_DIFF_OTHER,
    ConditionType.LONG_TERM_OTHER,
    ConditionType.NEURO_OTHER,
  ])(
    'happy path - validation passes given the Condition is of type %s and there is a condition name',
    async conditionType => {
      // Given
      req.journeyData.conditionDto = aValidConditionDto({ conditionTypeCode: conditionType })

      const requestBody = {
        conditionSource: 'SELF_DECLARED',
        conditionDetails: `Details for ${conditionType}`,
        conditionName: `Condition name for ${conditionType}`,
      }
      req.body = requestBody

      // When
      await validate(editDetailSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).toHaveBeenCalled()
      expect(req.flash).not.toHaveBeenCalled()
      expect(res.redirectWithErrors).not.toHaveBeenCalled()
    },
  )

  it.each([
    ConditionType.LD_OTHER,
    ConditionType.MENTAL_HEALTH,
    ConditionType.NEURODEGEN,
    ConditionType.PHYSICAL_OTHER,
    ConditionType.VISUAL_IMPAIR,
    ConditionType.OTHER,
    ConditionType.DLD_OTHER,
    ConditionType.LEARN_DIFF_OTHER,
    ConditionType.LONG_TERM_OTHER,
    ConditionType.NEURO_OTHER,
  ])(
    'sad path - validation fails given the Condition is of type %s and there is no condition name',
    async conditionType => {
      // Given
      req.journeyData.conditionDto = aValidConditionDto({ conditionTypeCode: conditionType })

      const requestBody = {
        conditionSource: 'SELF_DECLARED',
        conditionDetails: `Details for ${conditionType}`,
        conditionName: null as string,
      }
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#conditionName',
          text: 'Specify the condition',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(editDetailSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/conditions/A1234BC/f7dc617b-a6a8-42e7-ac0e-7d5a857f9b7d/edit/61375886-8ec3-4ed4-a017-a0525817f14a/detail',
        expectedErrors,
      )
    },
  )

  it.each([
    ConditionType.LD_OTHER,
    ConditionType.MENTAL_HEALTH,
    ConditionType.NEURODEGEN,
    ConditionType.PHYSICAL_OTHER,
    ConditionType.VISUAL_IMPAIR,
    ConditionType.OTHER,
    ConditionType.DLD_OTHER,
    ConditionType.LEARN_DIFF_OTHER,
    ConditionType.LONG_TERM_OTHER,
    ConditionType.NEURO_OTHER,
  ])(
    'sad path - validation fails given the Condition is of type %s and the condition name exceeds the max length',
    async conditionType => {
      // Given
      req.journeyData.conditionDto = aValidConditionDto({ conditionTypeCode: conditionType })

      const requestBody = {
        conditionSource: 'SELF_DECLARED',
        conditionDetails: `Details for ${conditionType}`,
        conditionName: 'a'.repeat(201),
      }
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#conditionName',
          text: 'Condition name must be 200 characters or less',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(editDetailSchema)(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/conditions/A1234BC/f7dc617b-a6a8-42e7-ac0e-7d5a857f9b7d/edit/61375886-8ec3-4ed4-a017-a0525817f14a/detail',
        expectedErrors,
      )
    },
  )

  it('sad path - validation fails given the condition source is not specified', async () => {
    // Given
    const requestBody = {
      conditionSource: null as string,
      conditionDetails: 'Details of the condition',
      conditionName: 'Condition name',
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#conditionSource',
        text: 'Select whether the condition was self-declared or diagnosed',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(editDetailSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/conditions/A1234BC/f7dc617b-a6a8-42e7-ac0e-7d5a857f9b7d/edit/61375886-8ec3-4ed4-a017-a0525817f14a/detail',
      expectedErrors,
    )
  })

  it('sad path - validation fails given the condition details are not specified', async () => {
    // Given
    const requestBody = {
      conditionSource: 'CONFIRMED_DIAGNOSIS',
      conditionDetails: null as string,
      conditionName: 'Condition name',
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#conditionDetails',
        text: 'Enter details of the condition',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(editDetailSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/conditions/A1234BC/f7dc617b-a6a8-42e7-ac0e-7d5a857f9b7d/edit/61375886-8ec3-4ed4-a017-a0525817f14a/detail',
      expectedErrors,
    )
  })

  it('sad path - validation fails given the condition details exceeds the max length', async () => {
    // Given
    const requestBody = {
      conditionSource: 'CONFIRMED_DIAGNOSIS',
      conditionDetails: 'a'.repeat(4001),
      conditionName: 'Condition name',
    }
    req.body = requestBody

    const expectedErrors: Array<Error> = [
      {
        href: '#conditionDetails',
        text: 'The condition detail must be 4000 characters or less',
      },
    ]
    const expectedInvalidForm = JSON.stringify(requestBody)

    // When
    await validate(editDetailSchema)(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).not.toHaveBeenCalled()
    expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
    expect(res.redirectWithErrors).toHaveBeenCalledWith(
      '/conditions/A1234BC/f7dc617b-a6a8-42e7-ac0e-7d5a857f9b7d/edit/61375886-8ec3-4ed4-a017-a0525817f14a/detail',
      expectedErrors,
    )
  })
})
