/**
 * Cypress scenarios for the Profile Challenges page.
 */

import { format, startOfToday, subDays } from 'date-fns'
import Page from '../../pages/page'
import { aValidAlnScreenerResponse } from '../../../server/testsupport/alnScreenerResponseTestDataBuilder'
import { aValidStrengthResponse } from '../../../server/testsupport/strengthResponseTestDataBuilder'
import { aValidChallengeResponse } from '../../../server/testsupport/challengeResponseTestDataBuilder'
import ChallengesPage from '../../pages/profile/challengesPage'
import ChallengeIdentificationSource from '../../../server/enums/challengeIdentificationSource'
import ChallengeCategory from '../../../server/enums/challengeCategory'
import ChallengeType from '../../../server/enums/challengeType'

context('Profile Challenges Page', () => {
  const prisonNumber = 'A00001A'

  const today = startOfToday()
  const yesterday = subDays(today, 1)
  const lastWeek = subDays(today, 7)

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.signIn()
    cy.task('getPrisonerById', prisonNumber)
  })

  it('should render the challenges page given the prisoner has both manually recorded challenges and challenges on an ALN Screener', () => {
    // Given
    cy.task('stubGetChallenges', {
      prisonNumber,
      challenges: [
        aValidChallengeResponse({
          challengeTypeCode: 'READING_COMPREHENSION',
          challengeCategory: 'LITERACY_SKILLS',
          howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
          fromALNScreener: false,
          symptoms: 'John struggles with all things literacy',
        }),
        aValidChallengeResponse({
          challengeTypeCode: 'MATHS_LITERACY',
          challengeCategory: 'NUMERACY_SKILLS',
          howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
          fromALNScreener: false,
          symptoms: 'John struggles with adding',
        }),
      ],
    })
    cy.task('stubGetAlnScreeners', {
      prisonNumber,
      screeners: [
        aValidAlnScreenerResponse({
          screenerDate: format(yesterday, 'yyyy-MM-dd'),
          strengths: [aValidStrengthResponse()],
        }),
        aValidAlnScreenerResponse({
          screenerDate: format(today, 'yyyy-MM-dd'),
          strengths: [],
          challenges: [
            aValidChallengeResponse({
              challengeTypeCode: 'MATHS_LITERACY',
              challengeCategory: 'NUMERACY_SKILLS',
              howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
              fromALNScreener: true,
            }),
            aValidChallengeResponse({
              challengeTypeCode: 'READING_COMPREHENSION',
              challengeCategory: 'LITERACY_SKILLS',
              howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
              fromALNScreener: true,
              symptoms: 'John struggles with all things literacy',
            }),
          ],
        }),
        aValidAlnScreenerResponse({
          screenerDate: format(lastWeek, 'yyyy-MM-dd'),
          strengths: [aValidStrengthResponse()],
          challenges: [
            aValidChallengeResponse({
              challengeTypeCode: 'STAMINA',
              challengeCategory: 'PHYSICAL_SKILLS',
              howIdentified: [ChallengeIdentificationSource.CONVERSATIONS, ChallengeIdentificationSource.OTHER],
              fromALNScreener: true,
            }),
          ],
        }),
      ],
    })

    // When
    cy.visit(`/profile/${prisonNumber}/challenges`)

    // Then
    Page.verifyOnPage(ChallengesPage) //
      .hasActiveChallengesSummaryCard(ChallengeCategory.NUMERACY_SKILLS)
      .hasActiveNonAlnChallenges(ChallengeCategory.NUMERACY_SKILLS, ChallengeType.MATHS_LITERACY)
      .hasActiveAlnChallenges(ChallengeCategory.NUMERACY_SKILLS, 'Maths literacy')
      .hasActiveChallengesSummaryCard(ChallengeCategory.LITERACY_SKILLS)
      .hasActiveNonAlnChallenges(ChallengeCategory.LITERACY_SKILLS, ChallengeType.READING_COMPREHENSION)
      .hasActiveAlnChallenges(ChallengeCategory.LITERACY_SKILLS, 'Reading comprehension')
      // Verify that there is not a Physical skills card as it was from an older screener result.
      .hasNoActiveChallengesSummaryCard(ChallengeCategory.PHYSICAL_SKILLS)
      .apiErrorBannerIsNotDisplayed()
  })

  it('should render the challenges page given the prisoner has no manually recorded challenges or challenges on an ALN Screener', () => {
    // Given
    cy.task('stubGetChallenges', { prisonNumber, challenges: [] })

    // When
    cy.visit(`/profile/${prisonNumber}/challenges`)

    // Then
    Page.verifyOnPage(ChallengesPage) //
      .hasNoActiveChallenges()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should render the challenges page given the API to get Challenges returns an error', () => {
    // Given
    cy.task('stubGetChallenges500Error', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/challenges`)

    // Then
    Page.verifyOnPage(ChallengesPage) //
      .apiErrorBannerIsDisplayed()
  })
})
