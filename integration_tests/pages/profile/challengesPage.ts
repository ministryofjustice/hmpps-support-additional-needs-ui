import ProfilePage from './profilePage'
import Page, { PageElement } from '../page'
import ChallengeCategory from '../../../server/enums/challengeCategory'
import ChallengeType from '../../../server/enums/challengeType'
import ChallengeDetailPage from '../challenges/challengeDetailPage'
import zeroIndexed from '../../utils/zeroIndexed'

export default class ChallengesPage extends ProfilePage {
  constructor() {
    super('profile-challenges')
    this.activeTabIs('Challenges')
  }

  clickToEditNthNonAlnChallenge(index: number): ChallengeDetailPage {
    this.nonAlnChallenges().eq(zeroIndexed(index)).find('[data-qa=edit-challenge-button]').click()
    return Page.verifyOnPage(ChallengeDetailPage)
  }

  hasChallengesSummaryCard(category: ChallengeCategory): ChallengesPage {
    this.challengeCategorySummaryCard(category).should('be.visible')
    return this
  }

  hasNoChallengesSummaryCard(category: ChallengeCategory): ChallengesPage {
    this.challengeCategorySummaryCard(category).should('not.exist')
    return this
  }

  hasNonAlnChallenges(category: ChallengeCategory, ...challengeType: Array<ChallengeType>): ChallengesPage {
    challengeType.forEach(challenge =>
      this.challengeCategorySummaryCard(category).find(`.non-aln-challenge[data-qa=${challenge}]`).should('be.visible'),
    )
    return this
  }

  hasNoNonAlnChallenges(category: ChallengeCategory): ChallengesPage {
    this.challengeCategorySummaryCard(category).find('.non-aln-challenge').should('not.exist')
    return this
  }

  hasAlnChallenges(category: ChallengeCategory, ...challenges: Array<string>): ChallengesPage {
    this.challengeCategorySummaryCard(category)
      .find('.aln-challenges li')
      .then(listItems => {
        cy.wrap(listItems).should('have.length', challenges.length)
        listItems.each((index, element) => {
          cy.wrap(element).should('contain.text', challenges[index])
        })
      })
    return this
  }

  hasNoAlnChallenges(category: ChallengeCategory): ChallengesPage {
    this.challengeCategorySummaryCard(category).find('.aln-challenges').should('not.exist')
    return this
  }

  hasNoActiveChallenges(): ChallengesPage {
    this.noChallengesSummaryCard().should('be.visible')
    return this
  }

  private noChallengesSummaryCard = (): PageElement => cy.get('[data-qa=no-challenges-summary-card]')

  private challengeCategorySummaryCard = (category: ChallengeCategory): PageElement =>
    cy.get(`[data-qa=challenges-summary-card-${category}]`)

  private nonAlnChallenges = (): PageElement => cy.get('.govuk-summary-list__row.non-aln-challenge')
}
