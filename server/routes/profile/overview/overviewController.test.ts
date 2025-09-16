import { Request, Response } from 'express'
import OverviewController from './overviewController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../utils/result/result'
import { aValidConditionsList } from '../../../testsupport/conditionDtoTestDataBuilder'
import {
  setupAlnChallenges,
  setupAlnScreenersPromise,
  setupAlnStrengths,
  setupNonAlnChallenges,
  setupNonAlnChallengesPromise,
  setupNonAlnStrengths,
  setupNonAlnStrengthsPromise,
} from '../profileTestSupportFunctions'
import { aValidAlnScreenerResponseDto } from '../../../testsupport/alnScreenerDtoTestDataBuilder'
import StrengthCategory from '../../../enums/strengthCategory'
import ChallengeCategory from '../../../enums/challengeCategory'
import { aCuriousAlnAndLddAssessmentsDto } from '../../../testsupport/curiousAlnAndLddAssessmentsDtoTestDataBuilder'
import aPlanLifecycleStatusDto from '../../../testsupport/planLifecycleStatusDtoTestDataBuilder'
import aValidSupportStrategyResponseDto from '../../../testsupport/supportStrategyResponseDtoTestDataBuilder'

describe('overviewController', () => {
  const controller = new OverviewController()

  const prisonerSummary = aValidPrisonerSummary()
  const educationSupportPlanLifecycleStatus = Result.fulfilled(aPlanLifecycleStatusDto())
  const conditions = Result.fulfilled(aValidConditionsList())
  const supportStrategies = Result.fulfilled([aValidSupportStrategyResponseDto()])
  // Use default SupportStrategyResponseDto builder values, which contains a Memory support strategy
  const expectedGroupedSupportStrategies = {
    MEMORY: [aValidSupportStrategyResponseDto()],
  }

  // Non-ALN strengths
  const { numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking } = setupNonAlnStrengths()
  const strengths = setupNonAlnStrengthsPromise({
    strengths: [numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking],
  })

  // Non-ALN Challenges
  const {
    numeracyChallenge,
    numeracy2Challenge,
    literacyChallenge,
    emotionsNonActiveChallenge,
    attentionChallenge,
    speakingChallenge,
  } = setupNonAlnChallenges()
  const challenges = setupNonAlnChallengesPromise([
    numeracyChallenge,
    numeracy2Challenge,
    literacyChallenge,
    emotionsNonActiveChallenge,
    attentionChallenge,
    speakingChallenge,
  ])

  // Latest ALN strengths
  const { reading, writing, alphabetOrdering, wordFindingNonActive, arithmetic, focussing, tidiness } =
    setupAlnStrengths()

  // Latest ALN strengths
  const {
    readingChallenge,
    writingChallenge,
    alphabetOrderingChallenge,
    wordFindingNonActiveChallenge,
    arithmeticChallenge,
    focussingChallenge,
    tidinessChallenge,
  } = setupAlnChallenges()

  const latestScreener = aValidAlnScreenerResponseDto({
    strengths: [reading, writing, wordFindingNonActive, arithmetic, focussing, tidiness, alphabetOrdering],
    challenges: [
      readingChallenge,
      writingChallenge,
      wordFindingNonActiveChallenge,
      arithmeticChallenge,
      focussingChallenge,
      tidinessChallenge,
      alphabetOrderingChallenge,
    ],
  })
  const alnScreeners = setupAlnScreenersPromise({ latestScreener })
  const curiousAlnAndLddAssessments = Result.fulfilled(aCuriousAlnAndLddAssessmentsDto())
  const prisonNamesById = Result.fulfilled({ BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' })

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: {
      prisonerSummary,
      educationSupportPlanLifecycleStatus,
      conditions,
      curiousAlnAndLddAssessments,
      strengths,
      alnScreeners,
      challenges,
      prisonNamesById,
      supportStrategies,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    res.locals.strengths = strengths
    res.locals.challenges = challenges
    res.locals.alnScreeners = alnScreeners
    res.locals.supportStrategies = supportStrategies
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/overview/index'

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
      conditions,
      curiousAlnAndLddAssessments,
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
      challengeCategories: expect.objectContaining({
        status: 'fulfilled',
        value: [
          ChallengeCategory.ATTENTION_ORGANISING_TIME,
          ChallengeCategory.LANGUAGE_COMM_SKILLS,
          ChallengeCategory.LITERACY_SKILLS,
          ChallengeCategory.NUMERACY_SKILLS,
        ],
      }),
      groupedSupportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedSupportStrategies,
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
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
      conditions,
      curiousAlnAndLddAssessments,
      tab: 'overview',
      strengthCategories: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
      groupedSupportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedSupportStrategies,
      }),
    })

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render the view given the challenges promise is not resolved', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/overview/index'

    const expectedError = new Error('Some error retrieving challenges')
    res.locals.challenges = Result.rejected(expectedError)

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
      conditions,
      tab: 'overview',
      challengeCategories: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
      groupedSupportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedSupportStrategies,
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
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
      conditions,
      curiousAlnAndLddAssessments,
      tab: 'overview',
      strengthCategories: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
      groupedSupportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedSupportStrategies,
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
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
      conditions,
      curiousAlnAndLddAssessments,
      tab: 'overview',
      strengthCategories: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
      groupedSupportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedSupportStrategies,
      }),
    })

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render the view with challenges, when an error occurs with strengths', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/overview/index'

    // Strengths has failed
    res.locals.strengths = Result.rejected(new Error('Some error retrieving strengths'))

    const expectedError = new Error('Some error retrieving strengths')

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
      conditions,
      curiousAlnAndLddAssessments,
      tab: 'overview',
      strengthCategories: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
      challengeCategories: expect.objectContaining({
        status: 'fulfilled',
        value: [
          ChallengeCategory.ATTENTION_ORGANISING_TIME,
          ChallengeCategory.LANGUAGE_COMM_SKILLS,
          ChallengeCategory.LITERACY_SKILLS,
          ChallengeCategory.NUMERACY_SKILLS,
        ],
      }),
      groupedSupportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedSupportStrategies,
      }),
    })

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render the view with strengths, when an error occurs with challenges', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/overview/index'

    // Challenges has failed
    res.locals.challenges = Result.rejected(new Error('Some error retrieving challenges'))

    const expectedError = new Error('Some error retrieving challenges')

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
      conditions,
      curiousAlnAndLddAssessments,
      tab: 'overview',
      challengeCategories: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
      strengthCategories: expect.objectContaining({
        status: 'fulfilled',
        value: [
          ChallengeCategory.ATTENTION_ORGANISING_TIME,
          ChallengeCategory.LANGUAGE_COMM_SKILLS,
          ChallengeCategory.LITERACY_SKILLS,
          ChallengeCategory.NUMERACY_SKILLS,
        ],
      }),
      groupedSupportStrategies: expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedSupportStrategies,
      }),
    })

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
