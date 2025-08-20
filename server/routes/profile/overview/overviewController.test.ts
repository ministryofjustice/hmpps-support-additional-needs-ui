import { Request, Response } from 'express'
import OverviewController from './overviewController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidPlanCreationScheduleDto from '../../../testsupport/planCreationScheduleDtoTestDataBuilder'
import { Result } from '../../../utils/result/result'
import { aValidConditionsList } from '../../../testsupport/conditionDtoTestDataBuilder'
import {
  setupAlnScreenersPromise,
  setupAlnStrengths,
  setupNonAlnStrengths,
  setupNonAlnStrengthsPromise,
} from '../profileTestSupportFunctions'
import { aValidAlnScreenerResponseDto } from '../../../testsupport/alnScreenerDtoTestDataBuilder'
import StrengthCategory from '../../../enums/strengthCategory'

describe('overviewController', () => {
  const controller = new OverviewController()

  const prisonerSummary = aValidPrisonerSummary()
  const educationSupportPlanCreationSchedule = Result.fulfilled(aValidPlanCreationScheduleDto())
  const conditions = Result.fulfilled(aValidConditionsList())

  // Non-ALN strengths
  const { numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking } = setupNonAlnStrengths()
  const strengths = setupNonAlnStrengthsPromise({
    strengths: [numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking],
  })

  // Latest ALN strengths
  const { reading, writing, alphabetOrdering, wordFindingNonActive, arithmetic, focussing, tidiness } =
    setupAlnStrengths()
  const latestScreener = aValidAlnScreenerResponseDto({
    strengths: [reading, writing, wordFindingNonActive, arithmetic, focussing, tidiness, alphabetOrdering],
  })
  const alnScreeners = setupAlnScreenersPromise({ latestScreener })

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, educationSupportPlanCreationSchedule, conditions, strengths, alnScreeners },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals.strengths = strengths
    res.locals.alnScreeners = alnScreeners
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/overview/index'
    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      educationSupportPlanCreationSchedule,
      conditions,
      tab: 'overview',
      strengthCategories: expect.objectContaining({
        status: 'fulfilled',
        value: [
          StrengthCategory.ATTENTION_ORGANISING_TIME,
          StrengthCategory.LANGUAGE_COMM_SKILLS,
          StrengthCategory.LITERACY_SKILLS,
          StrengthCategory.NUMERACY_SKILLS,
        ],
      }),
    })

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render the view given the strengths promise is not resolved', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/overview/index'

    const expectedError = new Error('Some error retrieving strengths')
    res.locals.strengths = Result.rejected(expectedError)

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      educationSupportPlanCreationSchedule,
      conditions,
      tab: 'overview',
      strengthCategories: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
    })

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render the view given the ALN Screeners promise is not resolved', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/overview/index'

    const expectedError = new Error('Some error retrieving ALN Screeners')
    res.locals.alnScreeners = Result.rejected(expectedError)

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      educationSupportPlanCreationSchedule,
      conditions,
      tab: 'overview',
      strengthCategories: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
    })

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render the view given both the Strengths and ALN Screeners promises are not resolved', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/overview/index'

    res.locals.strengths = Result.rejected(new Error('Some error retrieving strengths'))
    res.locals.alnScreeners = Result.rejected(new Error('Some error retrieving ALN Screeners'))

    const expectedError = new Error('Some error retrieving ALN Screeners, Some error retrieving strengths')

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      educationSupportPlanCreationSchedule,
      conditions,
      tab: 'overview',
      strengthCategories: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
    })

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
