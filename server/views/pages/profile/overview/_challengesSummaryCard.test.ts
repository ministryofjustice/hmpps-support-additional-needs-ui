import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfToday } from 'date-fns'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import formatChallengeCategoryScreenValueFilter from '../../../../filters/formatChallengeCategoryFilter'
import ChallengeCategory from '../../../../enums/challengeCategory'
import aValidChallengeResponseDto from '../../../../testsupport/challengeResponseDtoTestDataBuilder'
import ChallengeType from '../../../../enums/challengeType'

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
  .addFilter('assetMap', () => '')
  .addFilter('formatChallengeCategoryScreenValue', formatChallengeCategoryScreenValueFilter)

const prisonNumber = 'A1234BC'
const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
const template = '_challengesSummaryCard.njk'

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary,
  groupedChallenges: Result.fulfilled({}),
  challengeCategories: Result.fulfilled([ChallengeCategory.LITERACY_SKILLS, ChallengeCategory.NUMERACY_SKILLS]),
  userHasPermissionTo,
}

describe('_challengesSummaryCard', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the summary card given the prisoner has Challenges', () => {
    // Given
    const params = {
      ...templateParams,
      groupedChallenges: Result.fulfilled({
        ATTENTION_ORGANISING_TIME: {
          nonAlnChallenges: [
            aValidChallengeResponseDto({
              challengeTypeCode: ChallengeType.ATTENTION_ORGANISING_TIME_DEFAULT,
            }),
          ],
          latestAlnScreener: {
            screenerDate: startOfToday(),
            createdAtPrison: 'BXI',
            challenges: [],
          },
        },
        LITERACY_SKILLS: {
          nonAlnChallenges: [
            aValidChallengeResponseDto({
              challengeTypeCode: ChallengeType.LITERACY_SKILLS_DEFAULT,
            }),
          ],
          latestAlnScreener: {
            screenerDate: startOfToday(),
            createdAtPrison: 'BXI',
            challenges: [],
          },
        },
        MEMORY: {
          nonAlnChallenges: [
            aValidChallengeResponseDto({
              challengeTypeCode: ChallengeType.MEMORY,
            }),
          ],
          latestAlnScreener: {
            screenerDate: startOfToday(),
            createdAtPrison: 'BXI',
            challenges: [],
          },
        },
        NUMERACY_SKILLS: {
          nonAlnChallenges: [],
          latestAlnScreener: {
            screenerDate: startOfToday(),
            createdAtPrison: 'BXI',
            challenges: [
              aValidChallengeResponseDto({
                challengeTypeCode: ChallengeType.ARITHMETIC,
                challengeCategory: ChallengeCategory.NUMERACY_SKILLS,
              }),
            ],
          },
        },
        SENSORY: {
          nonAlnChallenges: [],
          latestAlnScreener: {
            screenerDate: startOfToday(),
            createdAtPrison: 'BXI',
            challenges: [
              aValidChallengeResponseDto({
                challengeTypeCode: ChallengeType.CREATIVITY,
              }),
            ],
          },
        },
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(1)
    expect($('[data-qa=view-challenges-button]').length).toEqual(1)

    const challengeListItems = $('.govuk-summary-card__content li')
    expect(challengeListItems.length).toEqual(5) // Expect 5 list items, one for each Challenge
    expect(challengeListItems.eq(0).text().trim()).toEqual('Attention, organising and time management')
    expect(challengeListItems.eq(1).text().trim()).toEqual('Literacy skills')
    expect(challengeListItems.eq(2).text().trim()).toEqual('Memory')
    expect(challengeListItems.eq(3).text().trim()).toEqual('Numeracy skills')
    expect(challengeListItems.eq(4).text().trim()).toEqual('Sensory')

    expect($('[data-qa=no-challenges-recorded-message]').length).toEqual(0)
    expect($('[data-qa=challenges-unavailable-message]').length).toEqual(0)
  })

  it('should render the summary card given the prisoner has no Challenges and the user has permission to create Challenges', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      groupedChallenges: Result.fulfilled({}),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(1)
    expect($('[data-qa=add-challenge-button]').length).toEqual(1)
    expect($('[data-qa=no-challenges-recorded-message]').length).toEqual(1)
    expect($('[data-qa=challenges-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
  })

  it('should render the summary card given the prisoner has no Challenges and the user does not have permission to create Challenges', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = {
      ...templateParams,
      groupedChallenges: Result.fulfilled({}),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(0) // Expect no actions in the summary card header because the user does not have permission to create Challenges
    expect($('[data-qa=no-challenges-recorded-message]').length).toEqual(1)
    expect($('[data-qa=challenges-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
  })

  it('should render the summary card given the Challenges service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      groupedChallenges: Result.rejected(new Error('Failed to get challenges')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(0) // Expect no actions in the summary card header - The API to return the Challenges failed so we do not know whether to show the "add" or "view" link
    expect($('[data-qa=challenges-unavailable-message]').length).toEqual(1)
  })
})
