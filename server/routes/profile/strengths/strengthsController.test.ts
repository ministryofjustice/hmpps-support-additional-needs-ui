import { Request, Response } from 'express'
import { startOfToday, subDays } from 'date-fns'
import StrengthsController, { GroupedStrengths } from './strengthsController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidStrengthResponseDto, aValidStrengthsList } from '../../../testsupport/strengthResponseDtoTestDataBuilder'
import { Result } from '../../../utils/result/result'
import { aValidAlnScreenerList, aValidAlnScreenerResponseDto } from '../../../testsupport/alnScreenerDtoTestDataBuilder'
import StrengthType from '../../../enums/strengthType'
import StrengthCategory from '../../../enums/strengthCategory'

const today = startOfToday()

describe('strengthsController', () => {
  const controller = new StrengthsController()

  const prisonerSummary = aValidPrisonerSummary()

  const screenerDate = today

  // Non-ALN strengths
  const { numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking } = setupNonAlnStrengths()
  const strengths = Result.fulfilled(
    aValidStrengthsList({ strengths: [numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking] }),
  )

  // Latest ALN strengths
  const { reading, writing, alphabetOrdering, wordFindingNonActive, arithmetic, focussing, tidiness } =
    setupAlnStrengths()
  const alnScreeners = Result.fulfilled(
    aValidAlnScreenerList({
      screeners: [
        // Latest screener
        aValidAlnScreenerResponseDto({
          screenerDate,
          strengths: [reading, writing, wordFindingNonActive, arithmetic, focussing, tidiness, alphabetOrdering],
        }),
        // Screener from yesterday
        aValidAlnScreenerResponseDto({ screenerDate: subDays(today, 1) }),
        // Screener from the day before yesterday
        aValidAlnScreenerResponseDto({ screenerDate: subDays(today, 2) }),
      ],
    }),
  )

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, strengths, alnScreeners },
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
          strengths: [focussing, tidiness],
        },
      },
      LITERACY_SKILLS: {
        nonAlnStrengths: [literacy],
        latestAlnScreener: {
          screenerDate,
          strengths: [alphabetOrdering, reading, writing],
        },
      },
      NUMERACY_SKILLS: {
        nonAlnStrengths: [numeracy2, numeracy],
        latestAlnScreener: {
          screenerDate,
          strengths: [arithmetic],
        },
      },
      LANGUAGE_COMM_SKILLS: {
        nonAlnStrengths: [speaking],
        latestAlnScreener: {
          screenerDate,
          strengths: [],
        },
      },
    }

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      strengths,
      alnScreeners,
      tab: 'strengths',
      groupedStrengths: expect.objectContaining({
        status: 'fulfilled',
        value: expectedGroupedStrengths,
      }),
    })

    // When
    await controller.getStrengthsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render the view given the strengths promise is not resolved', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/strengths/index'

    const expectedError = new Error('Some error retrieving strengths')
    const strengthsPromise = Result.rejected(expectedError)
    res.locals.strengths = strengthsPromise

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      strengths: strengthsPromise,
      alnScreeners,
      tab: 'strengths',
      groupedStrengths: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
    })

    // When
    await controller.getStrengthsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render the view given the ALN Screeners promise is not resolved', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/strengths/index'

    const expectedError = new Error('Some error retrieving ALN Screeners')
    const alnScreenersPromise = Result.rejected(expectedError)
    res.locals.alnScreeners = alnScreenersPromise

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      strengths,
      alnScreeners: alnScreenersPromise,
      tab: 'strengths',
      groupedStrengths: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
    })

    // When
    await controller.getStrengthsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render the view given both the Strengths and ALN Screeners promises are not resolved', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/strengths/index'

    const strengthsPromise = Result.rejected(new Error('Some error retrieving strengths'))
    res.locals.strengths = strengthsPromise

    const alnScreenersPromise = Result.rejected(new Error('Some error retrieving ALN Screeners'))
    res.locals.alnScreeners = alnScreenersPromise

    const expectedError = new Error('Some error retrieving ALN Screeners, Some error retrieving strengths')

    const expectedViewModel = expect.objectContaining({
      prisonerSummary,
      strengths: strengthsPromise,
      alnScreeners: alnScreenersPromise,
      tab: 'strengths',
      groupedStrengths: expect.objectContaining({
        status: 'rejected',
        reason: expectedError,
      }),
    })

    // When
    await controller.getStrengthsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})

export function setupNonAlnStrengths() {
  const numeracy = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.NUMERACY_SKILLS_DEFAULT,
    strengthCategory: StrengthCategory.NUMERACY_SKILLS,
    symptoms: 'Can add up really well',
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 5),
  })
  const numeracy2 = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.NUMERACY_SKILLS_DEFAULT,
    strengthCategory: StrengthCategory.NUMERACY_SKILLS,
    symptoms: 'Can subtract really well',
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 3),
  })
  const literacy = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.LITERACY_SKILLS_DEFAULT,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 1),
  })
  const emotionsNonActive = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.EMOTIONS_FEELINGS_DEFAULT,
    strengthCategory: StrengthCategory.EMOTIONS_FEELINGS,
    fromALNScreener: false,
    active: false,
    updatedAt: subDays(today, 1),
  })
  const attention = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.ATTENTION_ORGANISING_TIME_DEFAULT,
    strengthCategory: StrengthCategory.ATTENTION_ORGANISING_TIME,
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 10),
  })
  const speaking = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.SPEAKING,
    strengthCategory: StrengthCategory.LANGUAGE_COMM_SKILLS,
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 2),
  })

  return { numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking }
}

export function setupAlnStrengths() {
  const reading = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.READING,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const writing = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.WRITING,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const alphabetOrdering = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.ALPHABET_ORDERING,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const wordFindingNonActive = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.WORD_FINDING,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: false,
  })
  const arithmetic = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.ARITHMETIC,
    strengthCategory: StrengthCategory.NUMERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const focussing = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.FOCUSING,
    strengthCategory: StrengthCategory.ATTENTION_ORGANISING_TIME,
    fromALNScreener: true,
    active: true,
  })
  const tidiness = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.TIDINESS,
    strengthCategory: StrengthCategory.ATTENTION_ORGANISING_TIME,
    fromALNScreener: true,
    active: true,
  })

  return { reading, writing, alphabetOrdering, wordFindingNonActive, arithmetic, focussing, tidiness }
}
