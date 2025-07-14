import type { ReferenceDataItemDto } from 'dto'
import { toGroupedReferenceDataItems, toReferenceDataItems } from './referenceDataListResponseMapper'
import {
  aValidChallengeReferenceData,
  aValidReferenceDataListResponse,
} from '../../testsupport/referenceDataResponseTestDataBuilder'

describe('referenceDataListResponseMapper', () => {
  describe('toGroupedReferenceDataItems', () => {
    it('should map a ReferenceDataListResponse representing Challenge to a group list of ReferenceDataItemDto', () => {
      // Given
      const challengeRefData = aValidChallengeReferenceData()

      const apiResponse = aValidReferenceDataListResponse({
        referenceDataList: [
          { ...challengeRefData, code: 'HANDWRITING', categoryCode: 'PHYSICAL_SKILLS', areaCode: 'PHYSICAL_SENSORY' },
          {
            ...challengeRefData,
            code: 'TURN_TAKING',
            categoryCode: 'LANGUAGE_COMM_SKILLS',
            areaCode: 'COMMUNICATION_INTERACTION',
          },
          { ...challengeRefData, code: 'READING', categoryCode: 'LITERACY_SKILLS', areaCode: 'COGNITION_LEARNING' },
          {
            ...challengeRefData,
            code: 'SPEED_OF_CALCULATION',
            categoryCode: 'NUMERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'RESTFULNESS',
            categoryCode: 'EMOTIONS_FEELINGS',
            areaCode: 'SOCIAL_EMOTIONAL_MENTAL',
          },
          {
            ...challengeRefData,
            code: 'AUDITORY_DISCRIMINATION',
            categoryCode: 'SENSORY',
            areaCode: 'PHYSICAL_SENSORY',
          },
          {
            ...challengeRefData,
            code: 'FOCUSING',
            categoryCode: 'ATTENTION_ORGANISING_TIME',
            areaCode: 'COGNITION_LEARNING',
          },
          { ...challengeRefData, code: 'ARITHMETIC', categoryCode: 'NUMERACY_SKILLS', areaCode: 'COGNITION_LEARNING' },
          { ...challengeRefData, code: 'SPELLING', categoryCode: 'LITERACY_SKILLS', areaCode: 'COGNITION_LEARNING' },
          {
            ...challengeRefData,
            code: 'READING_EMOTIONS',
            categoryCode: 'EMOTIONS_FEELINGS',
            areaCode: 'SOCIAL_EMOTIONAL_MENTAL',
          },
          {
            ...challengeRefData,
            code: 'LANGUAGE_FLUENCY',
            categoryCode: 'LANGUAGE_COMM_SKILLS',
            areaCode: 'COMMUNICATION_INTERACTION',
          },
          {
            ...challengeRefData,
            code: 'TIDINESS',
            categoryCode: 'ATTENTION_ORGANISING_TIME',
            areaCode: 'COGNITION_LEARNING',
          },
          { ...challengeRefData, code: 'BALANCE', categoryCode: 'PHYSICAL_SKILLS', areaCode: 'PHYSICAL_SENSORY' },
          { ...challengeRefData, code: 'CREATIVITY', categoryCode: 'SENSORY', areaCode: 'PHYSICAL_SENSORY' },
          {
            ...challengeRefData,
            code: 'FINE_MOTOR_SKILLS',
            categoryCode: 'PHYSICAL_SKILLS',
            areaCode: 'PHYSICAL_SENSORY',
          },
          {
            ...challengeRefData,
            code: 'EMPATHY',
            categoryCode: 'EMOTIONS_FEELINGS',
            areaCode: 'SOCIAL_EMOTIONAL_MENTAL',
          },
          { ...challengeRefData, code: 'ESTIMATION', categoryCode: 'NUMERACY_SKILLS', areaCode: 'COGNITION_LEARNING' },
          { ...challengeRefData, code: 'WRITING', categoryCode: 'LITERACY_SKILLS', areaCode: 'COGNITION_LEARNING' },
          {
            ...challengeRefData,
            code: 'FINISHING_TASKS',
            categoryCode: 'ATTENTION_ORGANISING_TIME',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'SOCIAL_ADAPTABILITY',
            categoryCode: 'LANGUAGE_COMM_SKILLS',
            areaCode: 'COMMUNICATION_INTERACTION',
          },
          { ...challengeRefData, code: 'LISTENING', categoryCode: 'SENSORY', areaCode: 'PHYSICAL_SENSORY' },
          {
            ...challengeRefData,
            code: 'COMMUNICATION',
            categoryCode: 'LANGUAGE_COMM_SKILLS',
            areaCode: 'COMMUNICATION_INTERACTION',
          },
          {
            ...challengeRefData,
            code: 'IMPULSE_CONTROL',
            categoryCode: 'EMOTIONS_FEELINGS',
            areaCode: 'SOCIAL_EMOTIONAL_MENTAL',
          },
          {
            ...challengeRefData,
            code: 'MATHS_LITERACY',
            categoryCode: 'NUMERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'LEARNING_NEW_SKILLS',
            categoryCode: 'PHYSICAL_SKILLS',
            areaCode: 'PHYSICAL_SENSORY',
          },
          { ...challengeRefData, code: 'SENSORY_PROCESSING', categoryCode: 'SENSORY', areaCode: 'PHYSICAL_SENSORY' },
          {
            ...challengeRefData,
            code: 'ALPHABET_ORDERING',
            categoryCode: 'LITERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'PROBLEM_SOLVING',
            categoryCode: 'ATTENTION_ORGANISING_TIME',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'TASK_INITIATION',
            categoryCode: 'ATTENTION_ORGANISING_TIME',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'EXTROVERSION_INTROVERSION',
            categoryCode: 'LANGUAGE_COMM_SKILLS',
            areaCode: 'COMMUNICATION_INTERACTION',
          },
          {
            ...challengeRefData,
            code: 'READING_COMPREHENSION',
            categoryCode: 'LITERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          },
          { ...challengeRefData, code: 'VISUAL_SKILLS', categoryCode: 'SENSORY', areaCode: 'PHYSICAL_SENSORY' },
          {
            ...challengeRefData,
            code: 'EMOTIONAL_CONTROL',
            categoryCode: 'EMOTIONS_FEELINGS',
            areaCode: 'SOCIAL_EMOTIONAL_MENTAL',
          },
          {
            ...challengeRefData,
            code: 'MATHS_CONFIDENCE',
            categoryCode: 'NUMERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'SPORTING_BALL_SKILLS',
            categoryCode: 'PHYSICAL_SKILLS',
            areaCode: 'PHYSICAL_SENSORY',
          },
          { ...challengeRefData, code: 'VISUAL_SPATIAL_SKILLS', categoryCode: 'SENSORY', areaCode: 'PHYSICAL_SENSORY' },
          {
            ...challengeRefData,
            code: 'READING_VISUAL_DISCRIMINATION',
            categoryCode: 'LITERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'FRACTIONS_PERCENTAGES',
            categoryCode: 'NUMERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'TIME_ALLOCATION',
            categoryCode: 'ATTENTION_ORGANISING_TIME',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'SOCIAL_NUANCES',
            categoryCode: 'LANGUAGE_COMM_SKILLS',
            areaCode: 'COMMUNICATION_INTERACTION',
          },
          {
            ...challengeRefData,
            code: 'MANAGING_CHANGE',
            categoryCode: 'EMOTIONS_FEELINGS',
            areaCode: 'SOCIAL_EMOTIONAL_MENTAL',
          },
          { ...challengeRefData, code: 'DUAL_TASKING', categoryCode: 'PHYSICAL_SKILLS', areaCode: 'PHYSICAL_SENSORY' },
          {
            ...challengeRefData,
            code: 'CONFIDENCE',
            categoryCode: 'EMOTIONS_FEELINGS',
            areaCode: 'SOCIAL_EMOTIONAL_MENTAL',
          },
          { ...challengeRefData, code: 'TRACKING', categoryCode: 'LITERACY_SKILLS', areaCode: 'COGNITION_LEARNING' },
          {
            ...challengeRefData,
            code: 'FOLDING_PACKING_SORTING',
            categoryCode: 'PHYSICAL_SKILLS',
            areaCode: 'PHYSICAL_SENSORY',
          },
          {
            ...challengeRefData,
            code: 'SPEAKING',
            categoryCode: 'LANGUAGE_COMM_SKILLS',
            areaCode: 'COMMUNICATION_INTERACTION',
          },
          {
            ...challengeRefData,
            code: 'SELF_ORGANISED',
            categoryCode: 'ATTENTION_ORGANISING_TIME',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'WORD_BASED_PROBLEMS',
            categoryCode: 'NUMERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'MONEY_MANAGEMENT',
            categoryCode: 'NUMERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'FORWARD_PLANNING',
            categoryCode: 'ATTENTION_ORGANISING_TIME',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'LANGUAGE_DECODING',
            categoryCode: 'LITERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'WORD_FINDING',
            categoryCode: 'LANGUAGE_COMM_SKILLS',
            areaCode: 'COMMUNICATION_INTERACTION',
          },
          { ...challengeRefData, code: 'CALM', categoryCode: 'EMOTIONS_FEELINGS', areaCode: 'SOCIAL_EMOTIONAL_MENTAL' },
          { ...challengeRefData, code: 'STAMINA', categoryCode: 'PHYSICAL_SKILLS', areaCode: 'PHYSICAL_SENSORY' },
          {
            ...challengeRefData,
            code: 'ACTIVE_LISTENING',
            categoryCode: 'LANGUAGE_COMM_SKILLS',
            areaCode: 'COMMUNICATION_INTERACTION',
          },
          { ...challengeRefData, code: 'GRASP', categoryCode: 'PHYSICAL_SKILLS', areaCode: 'PHYSICAL_SENSORY' },
          {
            ...challengeRefData,
            code: 'NUMBER_RECALL',
            categoryCode: 'NUMERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'ATTENTION_TO_DETAIL',
            categoryCode: 'ATTENTION_ORGANISING_TIME',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'SPATIAL_AWARENESS',
            categoryCode: 'PHYSICAL_SKILLS',
            areaCode: 'PHYSICAL_SENSORY',
          },
          {
            ...challengeRefData,
            code: 'NON_VERBAL_COMMUNICATION',
            categoryCode: 'LANGUAGE_COMM_SKILLS',
            areaCode: 'COMMUNICATION_INTERACTION',
          },
          {
            ...challengeRefData,
            code: 'TASK_SWITCHING',
            categoryCode: 'ATTENTION_ORGANISING_TIME',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'NUMBER_SEQUENCING',
            categoryCode: 'NUMERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'PEOPLE_PERSON',
            categoryCode: 'LANGUAGE_COMM_SKILLS',
            areaCode: 'COMMUNICATION_INTERACTION',
          },
        ],
      })

      const expected: Record<string, Array<ReferenceDataItemDto>> = {
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

      // When
      const actual = toGroupedReferenceDataItems(apiResponse)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('toReferenceDataItems', () => {
    it('should map a ReferenceDataListResponse to an array of ReferenceDataItemDto', () => {
      // Given
      const challengeRefData = aValidChallengeReferenceData()

      const apiResponse = aValidReferenceDataListResponse({
        referenceDataList: [
          {
            ...challengeRefData,
            code: 'LITERACY_SKILLS_DEFAULT',
            categoryCode: 'LITERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'NUMERACY_SKILLS_DEFAULT',
            categoryCode: 'NUMERACY_SKILLS',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'ATTENTION_ORGANISING_TIME_DEFAULT',
            categoryCode: 'ATTENTION_ORGANISING_TIME',
            areaCode: 'COGNITION_LEARNING',
          },
          {
            ...challengeRefData,
            code: 'LANGUAGE_COMM_SKILLS_DEFAULT',
            categoryCode: 'LANGUAGE_COMM_SKILLS',
            areaCode: 'COMMUNICATION_INTERACTION',
          },
          {
            ...challengeRefData,
            code: 'EMOTIONS_FEELINGS_DEFAULT',
            categoryCode: 'EMOTIONS_FEELINGS',
            areaCode: 'SOCIAL_EMOTIONAL_MENTAL',
          },
          {
            ...challengeRefData,
            code: 'PHYSICAL_SKILLS_DEFAULT',
            categoryCode: 'PHYSICAL_SKILLS',
            areaCode: 'PHYSICAL_SENSORY',
          },
          { ...challengeRefData, code: 'SENSORY', categoryCode: 'SENSORY', areaCode: 'PHYSICAL_SENSORY' },
          { ...challengeRefData, code: 'MEMORY', categoryCode: 'MEMORY', areaCode: 'MEMORY' },
          {
            ...challengeRefData,
            code: 'PROCESSING_SPEED',
            categoryCode: 'PROCESSING_SPEED',
            areaCode: 'PROCESSING_SPEED',
          },
        ],
      })

      const expected: Array<ReferenceDataItemDto> = [
        { areaCode: 'COGNITION_LEARNING', code: 'LITERACY_SKILLS_DEFAULT' },
        { areaCode: 'COGNITION_LEARNING', code: 'NUMERACY_SKILLS_DEFAULT' },
        { areaCode: 'COGNITION_LEARNING', code: 'ATTENTION_ORGANISING_TIME_DEFAULT' },
        { areaCode: 'COMMUNICATION_INTERACTION', code: 'LANGUAGE_COMM_SKILLS_DEFAULT' },
        { areaCode: 'SOCIAL_EMOTIONAL_MENTAL', code: 'EMOTIONS_FEELINGS_DEFAULT' },
        { areaCode: 'PHYSICAL_SENSORY', code: 'PHYSICAL_SKILLS_DEFAULT' },
        { areaCode: 'PHYSICAL_SENSORY', code: 'SENSORY' },
        { areaCode: 'MEMORY', code: 'MEMORY' },
        { areaCode: 'PROCESSING_SPEED', code: 'PROCESSING_SPEED' },
      ]

      // When
      const actual = toReferenceDataItems(apiResponse)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
