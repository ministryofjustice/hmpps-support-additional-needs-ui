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
    const requestBody = { fullName: 'A Person', jobRole: 'A Job Role' }
    req.body = requestBody

    // When
    await validate(addPersonConsultedSchema())(req, res, next)

    // Then
    expect(req.body).toEqual(requestBody)
    expect(next).toHaveBeenCalled()
    expect(req.flash).not.toHaveBeenCalled()
    expect(res.redirectWithErrors).not.toHaveBeenCalled()
  })

  describe('sad path tests for create journey', () => {
    it.each([
      //
      { fullName: null, jobRole: 'A Job Role' },
      { fullName: undefined, jobRole: 'A Job Role' },
      { fullName: '', jobRole: 'A Job Role' },
      { fullName: ' ', jobRole: 'A Job Role' },
      {
        fullName: `

    `,
        jobRole: 'A Job Role',
      },
    ])('sad path - fullName field validation fails for create journey - %s', async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#fullName',
          text: 'Enter the full name of the person who was consulted or involved in the creation of the plan',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(addPersonConsultedSchema({ journey: 'create' }))(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/other-people-consulted/add-person',
        expectedErrors,
      )
    })

    it.each([
      //
      { fullName: 'Bob', jobRole: null },
      { fullName: 'Bob', jobRole: undefined },
      { fullName: 'Bob', jobRole: '' },
      { fullName: 'Bob', jobRole: ' ' },
      {
        fullName: 'Bob',
        jobRole: `

      `,
      },
    ])('sad path - jobRole field validation fails for create journey - %s', async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#jobRole',
          text: 'Enter the job role of the person who was consulted or involved in the creation of the plan',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(addPersonConsultedSchema({ journey: 'create' }))(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/other-people-consulted/add-person',
        expectedErrors,
      )
    })

    it.each([
      //
      { fullName: null, jobRole: null },
      { fullName: undefined, jobRole: undefined },
      { fullName: '', jobRole: '' },
      { fullName: ' ', jobRole: ' ' },
      {
        fullName: `

      `,
        jobRole: `

      `,
      },
    ])('sad path - fullName and jobRole field validation fails for create journey - %s', async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#fullName',
          text: 'Enter the full name of the person who was consulted or involved in the creation of the plan',
        },
        {
          href: '#jobRole',
          text: 'Enter the job role of the person who was consulted or involved in the creation of the plan',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(addPersonConsultedSchema({ journey: 'create' }))(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/other-people-consulted/add-person',
        expectedErrors,
      )
    })

    it('sad path - fullName field length validation fails for create journey', async () => {
      // Given
      const requestBody = {
        fullName: 'a'.repeat(201),
        jobRole: 'A Job Role',
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
      await validate(addPersonConsultedSchema({ journey: 'create' }))(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/other-people-consulted/add-person',
        expectedErrors,
      )
    })

    it('sad path - jobRole field length validation fails for create journey', async () => {
      // Given
      const requestBody = {
        fullName: 'Rodney',
        jobRole: 'a'.repeat(201),
      }
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#jobRole',
          text: 'Job role must be 200 characters or less',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(addPersonConsultedSchema({ journey: 'create' }))(req, res, next)

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

  describe('sad path tests for review journey', () => {
    it.each([
      //
      { fullName: null, jobRole: 'A Job Role' },
      { fullName: undefined, jobRole: 'A Job Role' },
      { fullName: '', jobRole: 'A Job Role' },
      { fullName: ' ', jobRole: 'A Job Role' },
      {
        fullName: `

    `,
        jobRole: 'A Job Role',
      },
    ])('sad path - fullName field validation fails for review journey - %s', async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#fullName',
          text: `Enter the person's full name`,
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(addPersonConsultedSchema({ journey: 'review' }))(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/other-people-consulted/add-person',
        expectedErrors,
      )
    })

    it.each([
      //
      { fullName: 'Bob', jobRole: null },
      { fullName: 'Bob', jobRole: undefined },
      { fullName: 'Bob', jobRole: '' },
      { fullName: 'Bob', jobRole: ' ' },
      {
        fullName: 'Bob',
        jobRole: `

      `,
      },
    ])('sad path - jobRole field validation fails for review journey - %s', async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#jobRole',
          text: `Enter the person's job role`,
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(addPersonConsultedSchema({ journey: 'review' }))(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/other-people-consulted/add-person',
        expectedErrors,
      )
    })

    it.each([
      //
      { fullName: null, jobRole: null },
      { fullName: undefined, jobRole: undefined },
      { fullName: '', jobRole: '' },
      { fullName: ' ', jobRole: ' ' },
      {
        fullName: `

      `,
        jobRole: `

      `,
      },
    ])('sad path - fullName and jobRole field validation fails for review journey - %s', async requestBody => {
      // Given
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#fullName',
          text: `Enter the person's full name`,
        },
        {
          href: '#jobRole',
          text: `Enter the person's job role`,
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(addPersonConsultedSchema({ journey: 'review' }))(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/other-people-consulted/add-person',
        expectedErrors,
      )
    })

    it('sad path - fullName field length validation fails for review journey', async () => {
      // Given
      const requestBody = {
        fullName: 'a'.repeat(201),
        jobRole: 'A Job Role',
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
      await validate(addPersonConsultedSchema({ journey: 'review' }))(req, res, next)

      // Then
      expect(req.body).toEqual(requestBody)
      expect(next).not.toHaveBeenCalled()
      expect(req.flash).toHaveBeenCalledWith('invalidForm', expectedInvalidForm)
      expect(res.redirectWithErrors).toHaveBeenCalledWith(
        '/education-support-plan/A1234BC/create/61375886-8ec3-4ed4-a017-a0525817f14a/other-people-consulted/add-person',
        expectedErrors,
      )
    })

    it('sad path - jobRole field length validation fails for review journey', async () => {
      // Given
      const requestBody = {
        fullName: 'Rodney',
        jobRole: 'a'.repeat(201),
      }
      req.body = requestBody

      const expectedErrors: Array<Error> = [
        {
          href: '#jobRole',
          text: 'Job role must be 200 characters or less',
        },
      ]
      const expectedInvalidForm = JSON.stringify(requestBody)

      // When
      await validate(addPersonConsultedSchema({ journey: 'review' }))(req, res, next)

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
})
