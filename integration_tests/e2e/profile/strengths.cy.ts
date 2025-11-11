/**
 * Cypress scenarios for the Profile Strengths page.
 */

import { format, startOfToday, subDays } from 'date-fns'
import Page from '../../pages/page'
import StrengthsPage from '../../pages/profile/strengthsPage'
import StrengthCategory from '../../../server/enums/strengthCategory'
import { aValidAlnScreenerResponse } from '../../../server/testsupport/alnScreenerResponseTestDataBuilder'
import { aValidStrengthResponse } from '../../../server/testsupport/strengthResponseTestDataBuilder'
import StrengthType from '../../../server/enums/strengthType'

context('Profile Strengths Page', () => {
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

  it('should render the strengths page given the prisoner has both manually recorded Strengths and Strengths on an ALN Screener', () => {
    // Given
    cy.task('stubGetStrengths', {
      prisonNumber,
      strengths: [
        aValidStrengthResponse({
          strengthCategory: 'LITERACY_SKILLS',
          strengthTypeCode: 'LITERACY_SKILLS_DEFAULT',
          howIdentified: ['OTHER', 'CONVERSATIONS'],
          howIdentifiedOther: 'I have personally witnessed his excellent reading skills',
          fromALNScreener: false,
        }),
        aValidStrengthResponse({
          strengthCategory: 'ATTENTION_ORGANISING_TIME',
          strengthTypeCode: 'ATTENTION_ORGANISING_TIME_DEFAULT',
          howIdentified: ['COLLEAGUE_INFO'],
          howIdentifiedOther: null,
          fromALNScreener: false,
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
          strengths: [
            aValidStrengthResponse({
              strengthCategory: 'EMOTIONS_FEELINGS',
              strengthTypeCode: 'EMPATHY',
            }),
            aValidStrengthResponse({
              strengthCategory: 'ATTENTION_ORGANISING_TIME',
              strengthTypeCode: 'FOCUSING',
            }),
            aValidStrengthResponse({
              strengthCategory: 'ATTENTION_ORGANISING_TIME',
              strengthTypeCode: 'SELF_ORGANISED',
            }),
            aValidStrengthResponse({
              strengthCategory: 'ATTENTION_ORGANISING_TIME',
              strengthTypeCode: 'TASK_SWITCHING',
            }),
          ],
        }),
        aValidAlnScreenerResponse({
          screenerDate: format(lastWeek, 'yyyy-MM-dd'),
          strengths: [aValidStrengthResponse()],
        }),
      ],
    })

    // When
    cy.visit(`/profile/${prisonNumber}/strengths`)

    // Then
    Page.verifyOnPage(StrengthsPage) //
      .hasActiveStrengthsSummaryCard(StrengthCategory.ATTENTION_ORGANISING_TIME)
      .hasActiveNonAlnStrengths(
        StrengthCategory.ATTENTION_ORGANISING_TIME,
        StrengthType.ATTENTION_ORGANISING_TIME_DEFAULT,
      )
      .hasActiveAlnStrengths(
        StrengthCategory.ATTENTION_ORGANISING_TIME,
        'Focusing',
        'Self organised (routine)',
        'Task switching',
      )

      .hasActiveStrengthsSummaryCard(StrengthCategory.EMOTIONS_FEELINGS)
      .hasNoActiveNonAlnStrengths(StrengthCategory.EMOTIONS_FEELINGS)
      .hasActiveAlnStrengths(StrengthCategory.EMOTIONS_FEELINGS, 'Empathy')

      .hasActiveStrengthsSummaryCard(StrengthCategory.LITERACY_SKILLS)
      .hasActiveNonAlnStrengths(StrengthCategory.LITERACY_SKILLS, StrengthType.LITERACY_SKILLS_DEFAULT)
      .hasNoActiveAlnStrengths(StrengthCategory.LITERACY_SKILLS)

      .apiErrorBannerIsNotDisplayed()
  })

  it('should render the strengths page given the prisoner has no manually recorded Strengths or Strengths on an ALN Screener', () => {
    // Given
    cy.task('stubGetStrengths404Error', prisonNumber)
    cy.task('stubGetAlnScreeners404Error', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/strengths`)

    // Then
    Page.verifyOnPage(StrengthsPage) //
      .hasNoActiveStrengths()
      .apiErrorBannerIsNotDisplayed()
  })

  it('should render the strengths page given the API to get Strengths returns an error', () => {
    // Given
    cy.task('stubGetStrengths500Error', prisonNumber)

    // When
    cy.visit(`/profile/${prisonNumber}/strengths`)

    // Then
    Page.verifyOnPage(StrengthsPage) //
      .apiErrorBannerIsDisplayed()
  })
})
