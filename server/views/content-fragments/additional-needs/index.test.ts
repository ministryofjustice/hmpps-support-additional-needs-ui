import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfToday, subDays } from 'date-fns'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../utils/result/result'
import anAdditionalNeedsFactorsDto from '../../../testsupport/additionalNeedsFactorsDtoTestDataBuilder'
import filterArrayOnPropertyFilter from '../../../filters/filterArrayOnPropertyFilter'
import dedupeArrayFilter from '../../../filters/dedupeArrayFilter'
import mapPropertyFromArrayFilter from '../../../filters/mapPropertyFromArrayFilter'
import { aValidConditionDto } from '../../../testsupport/conditionDtoTestDataBuilder'
import ConditionType from '../../../enums/conditionType'
import ChallengeCategory from '../../../enums/challengeCategory'
import SupportStrategyType from '../../../enums/supportStrategyType'
import StrengthCategory from '../../../enums/strengthCategory'
import aValidChallengeResponseDto from '../../../testsupport/challengeResponseDtoTestDataBuilder'
import aValidSupportStrategyResponseDto from '../../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import { aValidSupportStrategyResponse } from '../../../testsupport/supportStrategyResponseTestDataBuilder'
import { aValidStrengthResponseDto } from '../../../testsupport/strengthResponseDtoTestDataBuilder'
import formatConditionTypeScreenValueFilter from '../../../filters/formatConditionTypeFilter'
import formatChallengeCategoryScreenValueFilter from '../../../filters/formatChallengeCategoryFilter'
import groupArrayByPropertyFilter from '../../../filters/groupArrayByPropertyFilter'
import { formatSupportStrategyTypeScreenValueFilter } from '../../../filters/formatSupportStrategyTypeFilter'
import formatStrengthCategoryScreenValueFilter from '../../../filters/formatStrengthCategoryFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('filterArrayOnProperty', filterArrayOnPropertyFilter)
  .addFilter('dedupeArray', dedupeArrayFilter)
  .addFilter('mapPropertyFromArray', mapPropertyFromArrayFilter)
  .addFilter('groupArrayByProperty', groupArrayByPropertyFilter)
  .addFilter('formatConditionTypeScreenValue', formatConditionTypeScreenValueFilter)
  .addFilter('formatChallengeCategoryScreenValue', formatChallengeCategoryScreenValueFilter)
  .addFilter('formatStrengthCategoryScreenValue', formatStrengthCategoryScreenValueFilter)
  .addFilter('formatSupportStrategyTypeScreenValue', formatSupportStrategyTypeScreenValueFilter)

const prisonerSummary = aValidPrisonerSummary({ prisonNumber: 'A1234BC' })
const template = 'index.njk'

const templateParams = {
  prisonerSummary,
  additionalNeedsFactors: Result.fulfilled(anAdditionalNeedsFactorsDto()),
  serviceUrl: 'http://localhost:3000',
}

const today = startOfToday()

describe('Additional Needs content fragment tests', () => {
  describe('render conditions', () => {
    it('should render conditions given Additional Needs Factors has active conditions', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({
          ...anAdditionalNeedsFactorsDto(),
          conditions: [
            aValidConditionDto({ active: false, conditionTypeCode: ConditionType.ABI }), // Not active so not expected to be rendered
            aValidConditionDto({
              active: true,
              conditionTypeCode: ConditionType.DYSLEXIA,
              updatedAt: subDays(today, 3),
            }),
            aValidConditionDto({ active: true, conditionTypeCode: ConditionType.ADHD, updatedAt: today }),
            aValidConditionDto({ active: false, conditionTypeCode: ConditionType.DYSLEXIA }), // Not active so not expected to be rendered
            aValidConditionDto({ active: false, conditionTypeCode: ConditionType.FASD }), // Not active so not expected to be rendered
            aValidConditionDto({
              active: true,
              conditionTypeCode: ConditionType.LD_OTHER,
              updatedAt: subDays(today, 2),
            }),
            aValidConditionDto({
              active: true,
              conditionTypeCode: ConditionType.DYSLEXIA,
              updatedAt: subDays(today, 1),
            }),
          ],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-conditions-message]').length).toEqual(0)
      expect($('.govuk-summary-list__row.condition').length).toEqual(4)
      expect($('.govuk-summary-list__row.condition').eq(0).find('h3').text().trim()).toEqual(
        'Attention deficit hyperactivity disorder (ADHD or ADD)',
      )
      expect($('.govuk-summary-list__row.condition').eq(1).find('h3').text().trim()).toEqual('Dyslexia')
      expect($('.govuk-summary-list__row.condition').eq(2).find('h3').text().trim()).toEqual('Learning disabilities')
      expect($('.govuk-summary-list__row.condition').eq(3).find('h3').text().trim()).toEqual('Dyslexia')
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })

    it('should render no conditions message given Additional Needs Factors has no conditions at all', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({ ...anAdditionalNeedsFactorsDto(), conditions: [] }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-conditions-message]').length).toEqual(1)
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })

    it('should render no conditions message given Additional Needs Factors has no active conditions', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({
          ...anAdditionalNeedsFactorsDto(),
          conditions: [aValidConditionDto({ active: false })],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-conditions-message]').length).toEqual(1)
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })
  })

  describe('render support strategies', () => {
    it('should render support strategies given Additional Needs Factors has active support strategies', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({
          ...anAdditionalNeedsFactorsDto(),
          supportStrategies: [
            aValidSupportStrategyResponseDto({
              active: false, // Not active so not expected to be rendered
              supportStrategyCategoryTypeCode: SupportStrategyType.SENSORY,
            }),
            aValidSupportStrategyResponseDto({
              active: true,
              supportStrategyCategoryTypeCode: SupportStrategyType.EMOTIONS_FEELINGS_DEFAULT,
              details: 'The most recent emotions and feelings support strategy',
              updatedAt: today,
            }),
            aValidSupportStrategyResponseDto({
              active: true,
              supportStrategyCategoryTypeCode: SupportStrategyType.NUMERACY_SKILLS_DEFAULT,
            }),
            aValidSupportStrategyResponseDto({
              active: true,
              supportStrategyCategoryTypeCode: SupportStrategyType.EMOTIONS_FEELINGS_DEFAULT,
              details: 'An older emotions and feelings support strategy',
              updatedAt: subDays(today, 1),
            }),
            aValidSupportStrategyResponseDto({
              active: true,
              supportStrategyCategoryTypeCode: SupportStrategyType.MEMORY,
            }),
          ],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-support-strategies-message]').length).toEqual(0)
      const supportStrategyRows = $('[data-qa=support-strategy-summary-list-row]')
      expect($(supportStrategyRows).length).toEqual(3)
      expect($(supportStrategyRows).eq(0).find('h3').text().trim()).toEqual('Emotions and feelings')
      expect($(supportStrategyRows).eq(0).find('p').eq(0).text().trim()).toEqual(
        'The most recent emotions and feelings support strategy',
      )
      expect($(supportStrategyRows).eq(0).find('p').eq(1).text().trim()).toEqual(
        'An older emotions and feelings support strategy',
      )
      expect($(supportStrategyRows).eq(1).find('h3').text().trim()).toEqual('Memory')
      expect($(supportStrategyRows).eq(2).find('h3').text().trim()).toEqual('Numeracy skills')
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })

    it('should render no support strategies message given Additional Needs Factors has no support strategies at all', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({ ...anAdditionalNeedsFactorsDto(), supportStrategies: [] }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-support-strategies-message]').length).toEqual(1)
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })

    it('should render no support strategies message given Additional Needs Factors has no active support strategies', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({
          ...anAdditionalNeedsFactorsDto(),
          supportStrategies: [aValidSupportStrategyResponse({ active: false })],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-support-strategies-message]').length).toEqual(1)
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })
  })

  describe('render challenges challenges', () => {
    it('should render challenges given Additional Needs Factors has active challenges', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({
          ...anAdditionalNeedsFactorsDto(),
          challenges: [
            aValidChallengeResponseDto({
              active: false, // Not active so not expected to be rendered
              challengeCategory: ChallengeCategory.SENSORY,
              fromALNScreener: false,
            }),
            aValidChallengeResponseDto({
              active: true,
              challengeCategory: ChallengeCategory.EMOTIONS_FEELINGS,
              symptoms: 'The most recent emotions and feelings challenge',
              updatedAt: today,
              fromALNScreener: false,
            }),
            aValidChallengeResponseDto({
              active: true,
              challengeCategory: ChallengeCategory.NUMERACY_SKILLS,
              fromALNScreener: false,
            }),
            aValidChallengeResponseDto({
              active: true,
              challengeCategory: ChallengeCategory.EMOTIONS_FEELINGS,
              symptoms: 'An older emotions and feelings challenge',
              updatedAt: subDays(today, 1),
              fromALNScreener: false,
            }),
            aValidChallengeResponseDto({
              active: true,
              challengeCategory: ChallengeCategory.MEMORY,
              fromALNScreener: false,
            }),
            aValidChallengeResponseDto({
              active: true,
              challengeCategory: ChallengeCategory.ATTENTION_ORGANISING_TIME,
              fromALNScreener: true, // Challenge is from an ALN Screener so not expected to be rendered
            }),
          ],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-challenges-message]').length).toEqual(0)
      const challengeRows = $('[data-qa=challenge-summary-list-row]')
      expect($(challengeRows).length).toEqual(3)
      expect($(challengeRows).eq(0).find('h3').text().trim()).toEqual('Emotions and feelings')
      expect($(challengeRows).eq(0).find('p').eq(0).text().trim()).toEqual(
        'The most recent emotions and feelings challenge',
      )
      expect($(challengeRows).eq(0).find('p').eq(1).text().trim()).toEqual('An older emotions and feelings challenge')
      expect($(challengeRows).eq(1).find('h3').text().trim()).toEqual('Memory')
      expect($(challengeRows).eq(2).find('h3').text().trim()).toEqual('Numeracy skills')
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })

    it('should render no challenges message given Additional Needs Factors has no challenges at all', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({ ...anAdditionalNeedsFactorsDto(), challenges: [] }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-challenges-message]').length).toEqual(1)
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })

    it('should render no challenges message given Additional Needs Factors has non-aln-screener challenges but none are active', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({
          ...anAdditionalNeedsFactorsDto(),
          challenges: [aValidChallengeResponseDto({ active: false, fromALNScreener: false })],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-challenges-message]').length).toEqual(1)
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })

    it('should render no challenges message given Additional Needs Factors has active challenges but non that are non-aln-screener', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({
          ...anAdditionalNeedsFactorsDto(),
          challenges: [aValidChallengeResponseDto({ active: true, fromALNScreener: true })],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-challenges-message]').length).toEqual(1)
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })
  })

  describe('render strengths strengths', () => {
    it('should render strengths given Additional Needs Factors has active strengths', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({
          ...anAdditionalNeedsFactorsDto(),
          strengths: [
            aValidStrengthResponseDto({
              active: false, // Not active so not expected to be rendered
              strengthCategory: StrengthCategory.SENSORY,
              fromALNScreener: false,
            }),
            aValidStrengthResponseDto({
              active: true,
              strengthCategory: StrengthCategory.EMOTIONS_FEELINGS,
              symptoms: 'The most recent emotions and feelings strength',
              updatedAt: today,
              fromALNScreener: false,
            }),
            aValidStrengthResponseDto({
              active: true,
              strengthCategory: StrengthCategory.NUMERACY_SKILLS,
              fromALNScreener: false,
            }),
            aValidStrengthResponseDto({
              active: true,
              strengthCategory: StrengthCategory.EMOTIONS_FEELINGS,
              symptoms: 'An older emotions and feelings strength',
              updatedAt: subDays(today, 1),
              fromALNScreener: false,
            }),
            aValidStrengthResponseDto({
              active: true,
              strengthCategory: StrengthCategory.MEMORY,
              fromALNScreener: false,
            }),
            aValidStrengthResponseDto({
              active: true,
              strengthCategory: StrengthCategory.ATTENTION_ORGANISING_TIME,
              fromALNScreener: true, // Strength is from an ALN Screener so not expected to be rendered
            }),
          ],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-strengths-message]').length).toEqual(0)
      const strengthRows = $('[data-qa=strength-summary-list-row]')
      expect($(strengthRows).length).toEqual(3)
      expect($(strengthRows).eq(0).find('h3').text().trim()).toEqual('Emotions and feelings')
      expect($(strengthRows).eq(0).find('p').eq(0).text().trim()).toEqual(
        'The most recent emotions and feelings strength',
      )
      expect($(strengthRows).eq(0).find('p').eq(1).text().trim()).toEqual('An older emotions and feelings strength')
      expect($(strengthRows).eq(1).find('h3').text().trim()).toEqual('Memory')
      expect($(strengthRows).eq(2).find('h3').text().trim()).toEqual('Numeracy skills')
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })

    it('should render no strengths message given Additional Needs Factors has no strengths at all', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({ ...anAdditionalNeedsFactorsDto(), strengths: [] }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-strengths-message]').length).toEqual(1)
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })

    it('should render no strengths message given Additional Needs Factors has non-aln-screener strengths but none are active', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({
          ...anAdditionalNeedsFactorsDto(),
          strengths: [aValidStrengthResponseDto({ active: false, fromALNScreener: false })],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-strengths-message]').length).toEqual(1)
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })

    it('should render no strengths message given Additional Needs Factors has active strengths but non that are non-aln-screener', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({
          ...anAdditionalNeedsFactorsDto(),
          strengths: [aValidStrengthResponseDto({ active: true, fromALNScreener: true })],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-strengths-message]').length).toEqual(1)
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })
  })

  describe('empty/error states', () => {
    it('should render the content fragment given the prisoner has no Additional Needs Factors', () => {
      // Given
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled(
          anAdditionalNeedsFactorsDto({
            conditions: [],
            challenges: [],
            supportStrategies: [],
            strengths: [],
          }),
        ),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(0)
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(1)
      expect($('[data-qa=no-additional-needs-factors-message] a').attr('href')).toEqual(
        'http://localhost:3000/profile/A1234BC/overview',
      )
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })

    it('should render the content fragment given the Additional Needs service API promise is not resolved', () => {
      // Given
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.rejected(new Error('Failed to get challenges')),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(0)
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(1)
    })
  })
})
