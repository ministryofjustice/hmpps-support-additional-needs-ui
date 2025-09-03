import ProfilePage from './profilePage'
import { PageElement } from '../page'
import ChallengeCategory from '../../../server/enums/challengeCategory'
import ChallengeType from '../../../server/enums/challengeType'

export default class ChallengesPage extends ProfilePage {
  constructor() {
    super('profile-challenges')
    this.activeTabIs('Challenges')
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
      this.challengeCategorySummaryCard(category)
        .find(`[data-qa=challenge-summary-list-row-non-aln-${challenge}]`)
        .should('be.visible'),
    )
    return this
  }

  hasNoNonAlnChallenges(category: ChallengeCategory): ChallengesPage {
    this.challengeCategorySummaryCard(category)
      .find(`[data-qa*=challenge-summary-list-row-non-aln-]`)
      .should('not.exist')
    return this
  }

  hasAlnChallenges(category: ChallengeCategory, ...challenges: Array<string>): ChallengesPage {
    this.challengeCategorySummaryCard(category)
      .find(`[data-qa=aln-challenge-summary-list-row] li`)
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
}
