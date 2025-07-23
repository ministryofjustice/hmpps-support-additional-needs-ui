import { Request, Response } from 'express'
import { startOfToday } from 'date-fns'
import type { ReferenceDataItemDto } from 'dto'
import CheckYourAnswersController, { mapSelectedTypesToCategories } from './checkYourAnswersController'
import { asArray } from '../../../../utils/utils'
import aValidAlnScreenerDto from '../../../../testsupport/alnScreenerDtoTestDataBuilder'
import ChallengeType from '../../../../enums/challengeType'
import StrengthType from '../../../../enums/strengthType'

describe('checkYourAnswersController', () => {
  const controller = new CheckYourAnswersController()

  const prisonNumber = 'A1234BC'
  const prisonId = 'MDI'

  const screenerDate = startOfToday()
  const alnScreenerDto = aValidAlnScreenerDto({
    prisonNumber,
    prisonId,
    screenerDate,
    challenges: [ChallengeType.ARITHMETIC],
    strengths: [StrengthType.READING, StrengthType.SPELLING],
  })

  const flash = jest.fn()

  const req = {
    session: {},
    journeyData: {},
    body: {},
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = { alnScreenerDto }
    res.locals.challengesReferenceData = {
      LITERACY_SKILLS: [
        { areaCode: 'COGNITION_LEARNING', code: 'READING' },
        { areaCode: 'COGNITION_LEARNING', code: 'SPELLING' },
      ],
      NUMERACY_SKILLS: [
        { areaCode: 'COGNITION_LEARNING', code: 'SPEED_OF_CALCULATION' },
        { areaCode: 'COGNITION_LEARNING', code: 'ARITHMETIC' },
      ],
    }
    res.locals.strengthsReferenceData = {
      LITERACY_SKILLS: [
        { areaCode: 'COGNITION_LEARNING', code: 'READING' },
        { areaCode: 'COGNITION_LEARNING', code: 'SPELLING' },
      ],
      NUMERACY_SKILLS: [
        { areaCode: 'COGNITION_LEARNING', code: 'SPEED_OF_CALCULATION' },
        { areaCode: 'COGNITION_LEARNING', code: 'ARITHMETIC' },
      ],
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/additional-learning-needs-screener/check-your-answers/index'
    const expectedViewModel = {
      form: {
        screenerInformationIsCorrect: null as string,
      },
      errorRecordingAlnScreener: false,
      screenerDate,
      challenges: {
        NUMERACY_SKILLS: ['ARITHMETIC'],
      },
      strengths: {
        LITERACY_SKILLS: ['READING', 'SPELLING'],
      },
    }

    // When
    await controller.getCheckYourAnswersView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    const invalidForm = {
      screenerInformationIsCorrect: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/additional-learning-needs-screener/check-your-answers/index'
    const expectedViewModel = {
      form: invalidForm,
      errorRecordingAlnScreener: false,
      screenerDate,
      challenges: {
        NUMERACY_SKILLS: ['ARITHMETIC'],
      },
      strengths: {
        LITERACY_SKILLS: ['READING', 'SPELLING'],
      },
    }

    // When
    await controller.getCheckYourAnswersView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should render view given api errors from previous submission', async () => {
    // Given
    flash.mockReturnValue(['true'])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/additional-learning-needs-screener/check-your-answers/index'
    const expectedViewModel = {
      form: {
        screenerInformationIsCorrect: null as string,
      },
      errorRecordingAlnScreener: true,
      screenerDate,
      challenges: {
        NUMERACY_SKILLS: ['ARITHMETIC'],
      },
      strengths: {
        LITERACY_SKILLS: ['READING', 'SPELLING'],
      },
    }

    // When
    await controller.getCheckYourAnswersView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    const expectedNextRoute = `/profile/${prisonNumber}/overview`

    // When
    await controller.submitCheckYourAnswersForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.alnScreenerDto).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
  })
})

describe('mapSelectedTypesToCategories', () => {
  const referenceData: Record<string, Array<ReferenceDataItemDto>> = {
    LITERACY_SKILLS: [
      { areaCode: 'COGNITION_LEARNING', code: 'READING' },
      { areaCode: 'COGNITION_LEARNING', code: 'SPELLING' },
      { areaCode: 'COGNITION_LEARNING', code: 'WRITING' },
      { areaCode: 'COGNITION_LEARNING', code: 'ALPHABET_ORDERING' },
      { areaCode: 'COGNITION_LEARNING', code: 'READING_COMPREHENSION' },
      { areaCode: 'COGNITION_LEARNING', code: 'READING_VISUAL_DISCRIMINATION' },
      { areaCode: 'COGNITION_LEARNING', code: 'TRACKING' },
      { areaCode: 'COGNITION_LEARNING', code: 'LANGUAGE_DECODING' },
    ],
    NUMERACY_SKILLS: [
      { areaCode: 'COGNITION_LEARNING', code: 'SPEED_OF_CALCULATION' },
      { areaCode: 'COGNITION_LEARNING', code: 'ARITHMETIC' },
      { areaCode: 'COGNITION_LEARNING', code: 'ESTIMATION' },
      { areaCode: 'COGNITION_LEARNING', code: 'MATHS_LITERACY' },
      { areaCode: 'COGNITION_LEARNING', code: 'MATHS_CONFIDENCE' },
      { areaCode: 'COGNITION_LEARNING', code: 'FRACTIONS_PERCENTAGES' },
      { areaCode: 'COGNITION_LEARNING', code: 'WORD_BASED_PROBLEMS' },
      { areaCode: 'COGNITION_LEARNING', code: 'MONEY_MANAGEMENT' },
      { areaCode: 'COGNITION_LEARNING', code: 'NUMBER_RECALL' },
      { areaCode: 'COGNITION_LEARNING', code: 'NUMBER_SEQUENCING' },
    ],
    ATTENTION_ORGANISING_TIME: [
      { areaCode: 'COGNITION_LEARNING', code: 'FOCUSING' },
      { areaCode: 'COGNITION_LEARNING', code: 'TIDINESS' },
      { areaCode: 'COGNITION_LEARNING', code: 'FINISHING_TASKS' },
      { areaCode: 'COGNITION_LEARNING', code: 'PROBLEM_SOLVING' },
      { areaCode: 'COGNITION_LEARNING', code: 'TASK_INITIATION' },
      { areaCode: 'COGNITION_LEARNING', code: 'TIME_ALLOCATION' },
      { areaCode: 'COGNITION_LEARNING', code: 'SELF_ORGANISED' },
      { areaCode: 'COGNITION_LEARNING', code: 'FORWARD_PLANNING' },
      { areaCode: 'COGNITION_LEARNING', code: 'ATTENTION_TO_DETAIL' },
      { areaCode: 'COGNITION_LEARNING', code: 'TASK_SWITCHING' },
    ],
    LANGUAGE_COMM_SKILLS: [
      { areaCode: 'COMMUNICATION_INTERACTION', code: 'TURN_TAKING' },
      { areaCode: 'COMMUNICATION_INTERACTION', code: 'LANGUAGE_FLUENCY' },
      { areaCode: 'COMMUNICATION_INTERACTION', code: 'SOCIAL_ADAPTABILITY' },
      { areaCode: 'COMMUNICATION_INTERACTION', code: 'COMMUNICATION' },
      { areaCode: 'COMMUNICATION_INTERACTION', code: 'EXTROVERSION_INTROVERSION' },
      { areaCode: 'COMMUNICATION_INTERACTION', code: 'SOCIAL_NUANCES' },
      { areaCode: 'COMMUNICATION_INTERACTION', code: 'SPEAKING' },
      { areaCode: 'COMMUNICATION_INTERACTION', code: 'WORD_FINDING' },
      { areaCode: 'COMMUNICATION_INTERACTION', code: 'ACTIVE_LISTENING' },
      { areaCode: 'COMMUNICATION_INTERACTION', code: 'NON_VERBAL_COMMUNICATION' },
      { areaCode: 'COMMUNICATION_INTERACTION', code: 'PEOPLE_PERSON' },
    ],
    EMOTIONS_FEELINGS: [
      { areaCode: 'SOCIAL_EMOTIONAL_MENTAL', code: 'RESTFULNESS' },
      { areaCode: 'SOCIAL_EMOTIONAL_MENTAL', code: 'READING_EMOTIONS' },
      { areaCode: 'SOCIAL_EMOTIONAL_MENTAL', code: 'EMPATHY' },
      { areaCode: 'SOCIAL_EMOTIONAL_MENTAL', code: 'IMPULSE_CONTROL' },
      { areaCode: 'SOCIAL_EMOTIONAL_MENTAL', code: 'EMOTIONAL_CONTROL' },
      { areaCode: 'SOCIAL_EMOTIONAL_MENTAL', code: 'MANAGING_CHANGE' },
      { areaCode: 'SOCIAL_EMOTIONAL_MENTAL', code: 'CONFIDENCE' },
      { areaCode: 'SOCIAL_EMOTIONAL_MENTAL', code: 'CALM' },
    ],
    PHYSICAL_SKILLS: [
      { areaCode: 'PHYSICAL_SENSORY', code: 'HANDWRITING' },
      { areaCode: 'PHYSICAL_SENSORY', code: 'BALANCE' },
      { areaCode: 'PHYSICAL_SENSORY', code: 'FINE_MOTOR_SKILLS' },
      { areaCode: 'PHYSICAL_SENSORY', code: 'LEARNING_NEW_SKILLS' },
      { areaCode: 'PHYSICAL_SENSORY', code: 'SPORTING_BALL_SKILLS' },
      { areaCode: 'PHYSICAL_SENSORY', code: 'DUAL_TASKING' },
      { areaCode: 'PHYSICAL_SENSORY', code: 'FOLDING_PACKING_SORTING' },
      { areaCode: 'PHYSICAL_SENSORY', code: 'STAMINA' },
      { areaCode: 'PHYSICAL_SENSORY', code: 'GRASP' },
      { areaCode: 'PHYSICAL_SENSORY', code: 'SPATIAL_AWARENESS' },
    ],
    SENSORY: [
      { areaCode: 'PHYSICAL_SENSORY', code: 'AUDITORY_DISCRIMINATION' },
      { areaCode: 'PHYSICAL_SENSORY', code: 'CREATIVITY' },
      { areaCode: 'PHYSICAL_SENSORY', code: 'LISTENING' },
      { areaCode: 'PHYSICAL_SENSORY', code: 'SENSORY_PROCESSING' },
      { areaCode: 'PHYSICAL_SENSORY', code: 'VISUAL_SKILLS' },
      { areaCode: 'PHYSICAL_SENSORY', code: 'VISUAL_SPATIAL_SKILLS' },
    ],
  }

  it('should map selected types to categories', () => {
    // Given
    const selectedTypes = [
      'CREATIVITY', // expect to be in SENSORY category
      'COMMUNICATION', // expect to be in LANGUAGE_COMM_SKILLS category
      'ARITHMETIC', // expect to be in NUMERACY_SKILLS category
      'VISUAL_SKILLS', // expect to be in SENSORY category
      'ESTIMATION', // expect to be in NUMERACY_SKILLS category
    ]

    const expected = {
      NUMERACY_SKILLS: ['ARITHMETIC', 'ESTIMATION'],
      LANGUAGE_COMM_SKILLS: ['COMMUNICATION'],
      SENSORY: ['CREATIVITY', 'VISUAL_SKILLS'],
    }

    // When
    const actual = mapSelectedTypesToCategories(selectedTypes, referenceData)

    // Then
    expect(actual).toEqual(expected)
  })

  it.each([
    //
    [],
    ['NONE'],
    undefined,
    null,
  ])('should return an empty object given selectedTypes %s', async selectedTypes => {
    // Given
    const expected = {}

    // When
    const actual = mapSelectedTypesToCategories(asArray(selectedTypes), referenceData)

    // Then
    expect(actual).toEqual(expected)
  })
})
