import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../utils/result/result'
import anAdditionalNeedsFactorsDto from '../../../testsupport/additionalNeedsFactorsDtoTestDataBuilder'
import filterArrayOnPropertyFilter from '../../../filters/filterArrayOnPropertyFilter'
import dedupeArrayFilter from '../../../filters/dedupeArrayFilter'
import mapPropertyFromArrayFilter from '../../../filters/mapPropertyFromArrayFilter'
import { aValidConditionDto } from '../../../testsupport/conditionDtoTestDataBuilder'
import ConditionType from '../../../enums/conditionType'
import formatConditionTypeScreenValueFilter from '../../../filters/formatConditionTypeFilter'
import aValidChallengeResponseDto from '../../../testsupport/challengeResponseDtoTestDataBuilder'
import aValidSupportStrategyResponseDto from '../../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import ChallengeCategory from '../../../enums/challengeCategory'
import SupportStrategyCategory from '../../../enums/supportStrategyCategory'
import formatChallengeCategoryScreenValueFilter from '../../../filters/formatChallengeCategoryFilter'

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
  .addFilter('formatConditionTypeScreenValue', formatConditionTypeScreenValueFilter)
  .addFilter('formatChallengeCategoryScreenValue', formatChallengeCategoryScreenValueFilter)

const prisonerSummary = aValidPrisonerSummary({ prisonNumber: 'A1234BC' })
const template = 'index.njk'

const templateParams = {
  prisonerSummary,
  additionalNeedsFactors: Result.fulfilled(anAdditionalNeedsFactorsDto()),
  serviceUrl: 'http://localhost:3000',
}

describe('Additional Needs content fragment tests', () => {
  describe('render conditions', () => {
    it('should render conditions message given Additional Needs Factors has active conditions', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({
          ...anAdditionalNeedsFactorsDto(),
          conditions: [
            aValidConditionDto({ active: false, conditionTypeCode: ConditionType.ABI }), // Not active so not expected to be rendered
            aValidConditionDto({ active: true, conditionTypeCode: ConditionType.DYSLEXIA }),
            aValidConditionDto({ active: true, conditionTypeCode: ConditionType.ADHD }),
            aValidConditionDto({ active: false, conditionTypeCode: ConditionType.DYSLEXIA }), // Not active so not expected to be rendered
            aValidConditionDto({ active: false, conditionTypeCode: ConditionType.FASD }), // Not active so not expected to be rendered
            aValidConditionDto({ active: true, conditionTypeCode: ConditionType.LD_OTHER }),
            aValidConditionDto({ active: true, conditionTypeCode: ConditionType.DYSLEXIA }),
          ],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-conditions-message]').length).toEqual(0)
      expect($('[data-qa=conditions-list] li').length).toEqual(3)
      expect($('[data-qa=conditions-list] li').eq(0).text().trim()).toEqual(
        'Attention deficit hyperactivity disorder (ADHD or ADD)',
      )
      expect($('[data-qa=conditions-list] li').eq(1).text().trim()).toEqual('Dyslexia')
      expect($('[data-qa=conditions-list] li').eq(2).text().trim()).toEqual('Learning disabilities')
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

  describe('render support needs', () => {
    it('should render conditions message given Additional Needs Factors has active challenges and active support strategies', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({
          ...anAdditionalNeedsFactorsDto(),
          challenges: [
            aValidChallengeResponseDto({
              active: false, // Not active so not expected to be rendered
              challengeCategory: ChallengeCategory.MEMORY,
              fromALNScreener: false,
            }),
            aValidChallengeResponseDto({
              active: true,
              challengeCategory: ChallengeCategory.SENSORY,
              fromALNScreener: false,
            }),
            aValidChallengeResponseDto({
              active: true,
              challengeCategory: ChallengeCategory.EMOTIONS_FEELINGS,
              fromALNScreener: false,
            }),
            aValidChallengeResponseDto({
              active: true,
              challengeCategory: ChallengeCategory.LITERACY_SKILLS,
              fromALNScreener: false,
            }),
            aValidChallengeResponseDto({
              active: true,
              challengeCategory: ChallengeCategory.LITERACY_SKILLS,
              fromALNScreener: false,
            }),
            aValidChallengeResponseDto({
              active: true,
              challengeCategory: ChallengeCategory.ATTENTION_ORGANISING_TIME,
              fromALNScreener: true, // From the ALN screener so not expected to be rendered
            }),
          ],
          supportStrategies: [
            aValidSupportStrategyResponseDto({
              active: false, // Not active so not expected to be rendered
              supportStrategyCategory: SupportStrategyCategory.SENSORY,
            }),
            aValidSupportStrategyResponseDto({
              active: true,
              supportStrategyCategory: SupportStrategyCategory.EMOTIONS_FEELINGS,
            }),
            aValidSupportStrategyResponseDto({
              active: true,
              supportStrategyCategory: SupportStrategyCategory.NUMERACY_SKILLS,
            }),
            aValidSupportStrategyResponseDto({
              active: true,
              supportStrategyCategory: SupportStrategyCategory.MEMORY,
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
      expect($('[data-qa=support-needs-list] li').length).toEqual(5)
      expect($('[data-qa=support-needs-list] li').eq(0).text().trim()).toEqual('Emotions and feelings')
      expect($('[data-qa=support-needs-list] li').eq(1).text().trim()).toEqual('Literacy skills')
      expect($('[data-qa=support-needs-list] li').eq(2).text().trim()).toEqual('Memory')
      expect($('[data-qa=support-needs-list] li').eq(3).text().trim()).toEqual('Numeracy skills')
      expect($('[data-qa=support-needs-list] li').eq(4).text().trim()).toEqual('Sensory')
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })

    it('should render no support needs message given Additional Needs Factors has no challenges and no support strategies at all', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({
          ...anAdditionalNeedsFactorsDto(),
          challenges: [],
          supportStrategies: [],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-support-needs-message]').length).toEqual(1)
      expect($('[data-qa=no-additional-needs-factors-message]').length).toEqual(0)
      expect($('[data-qa=additional-needs-factors-unavailable-message]').length).toEqual(0)
    })

    it('should render no support needs message given Additional Needs Factors has no active challenges and no active support strategies', () => {
      const params = {
        ...templateParams,
        additionalNeedsFactors: Result.fulfilled({
          ...anAdditionalNeedsFactorsDto(),
          challenges: [aValidChallengeResponseDto({ active: false })],
          supportStrategies: [aValidSupportStrategyResponseDto({ active: false })],
        }),
      }

      // When
      const content = njkEnv.render(template, params)
      const $ = cheerio.load(content)

      // Then
      expect($('[data-qa=additional-needs-factors]').length).toEqual(1)
      expect($('[data-qa=no-support-needs-message]').length).toEqual(1)
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
