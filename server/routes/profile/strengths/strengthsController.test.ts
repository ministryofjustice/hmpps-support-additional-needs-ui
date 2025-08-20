import { Request, Response } from 'express'
import { startOfToday } from 'date-fns'
import StrengthsController, { GroupedStrengths } from './strengthsController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../utils/result/result'
import {
  setupAlnScreenersPromise,
  setupAlnStrengths,
  setupNonAlnStrengths,
  setupNonAlnStrengthsPromise,
} from '../profileTestSupportFunctions'
import { aValidAlnScreenerResponseDto } from '../../../testsupport/alnScreenerDtoTestDataBuilder'

describe('strengthsController', () => {
  const controller = new StrengthsController()

  const prisonerSummary = aValidPrisonerSummary()

  const prisonId = 'MDI'
  const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }

  // Non-ALN strengths
  const { numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking } = setupNonAlnStrengths()
  const strengths = setupNonAlnStrengthsPromise({
    strengths: [numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking],
  })

  // Latest ALN strengths
  const { reading, writing, alphabetOrdering, wordFindingNonActive, arithmetic, focussing, tidiness } =
    setupAlnStrengths()
  const screenerDate = startOfToday()
  const latestScreener = aValidAlnScreenerResponseDto({
    screenerDate,
    createdAtPrison: prisonId,
    strengths: [reading, writing, wordFindingNonActive, arithmetic, focussing, tidiness, alphabetOrdering],
  })
  const alnScreeners = setupAlnScreenersPromise({ latestScreener })

  const render = jest.fn()
  const req = {} as unknown as Request
  const res = {
    render,
    locals: { prisonerSummary, strengths, alnScreeners, prisonNamesById },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals.strengths = strengths
    res.locals.alnScreeners = alnScreeners
  })

  it('should render the view given the strengths and alnScreeners promises are fulfilled', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/strengths/index'

    const expectedGroupedStrengths: GroupedStrengths = {
      ATTENTION_ORGANISING_TIME: {
        nonAlnStrengths: [attention],
        latestAlnScreener: {
          screenerDate,
          createdAtPrison: prisonId,
          strengths: [focussing, tidiness],
        },
      },
      LITERACY_SKILLS: {
        nonAlnStrengths: [literacy],
        latestAlnScreener: {
          screenerDate,
          createdAtPrison: prisonId,
          strengths: [alphabetOrdering, reading, writing],
        },
      },
      NUMERACY_SKILLS: {
        nonAlnStrengths: [numeracy2, numeracy],
        latestAlnScreener: {
          screenerDate,
          createdAtPrison: prisonId,
          strengths: [arithmetic],
        },
      },
      LANGUAGE_COMM_SKILLS: {
        nonAlnStrengths: [speaking],
        latestAlnScreener: {
          screenerDate,
          createdAtPrison: prisonId,
          strengths: [],
        },
      },
    }
    const expectedCategoryOrder = [
      'ATTENTION_ORGANISING_TIME',
      'LANGUAGE_COMM_SKILLS',
      'LITERACY_SKILLS',
      'NUMERACY_SKILLS',
    ]

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      prisonNamesById,
      tab: 'strengths',
      groupedStrengths: expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedStrengths,
      }),
    })

    // When
    await controller.getStrengthsView(req, res, next)

    // Then
    expect(render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    const actualGroupedStrengths = render.mock.calls[0][1].groupedStrengths.value
    const actualCategoryOrder = Object.keys(actualGroupedStrengths)
    expect(actualCategoryOrder).toEqual(expectedCategoryOrder)
  })

  it('should render the view given the strengths promise is not resolved', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/strengths/index'

    const expectedError = new Error('Some error retrieving strengths')
    res.locals.strengths = Result.rejected(expectedError)

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      prisonNamesById,
      tab: 'strengths',
      groupedStrengths: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
    })

    // When
    await controller.getStrengthsView(req, res, next)

    // Then
    expect(render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render the view given the ALN Screeners promise is not resolved', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/strengths/index'

    const expectedError = new Error('Some error retrieving ALN Screeners')
    res.locals.alnScreeners = Result.rejected(expectedError)

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      prisonNamesById,
      tab: 'strengths',
      groupedStrengths: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
    })

    // When
    await controller.getStrengthsView(req, res, next)

    // Then
    expect(render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render the view given both the Strengths and ALN Screeners promises are not resolved', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/strengths/index'

    res.locals.strengths = Result.rejected(new Error('Some error retrieving strengths'))
    res.locals.alnScreeners = Result.rejected(new Error('Some error retrieving ALN Screeners'))

    const expectedError = new Error('Some error retrieving ALN Screeners, Some error retrieving strengths')

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      prisonNamesById,
      tab: 'strengths',
      groupedStrengths: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
    })

    // When
    await controller.getStrengthsView(req, res, next)

    // Then
    expect(render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
