import ProfilePage from './profilePage'
import Page, { PageElement } from '../page'
import SelectChallengeCategoryPage from '../challenges/selectChallengeCategoryPage'
import ScreenerDatePage from '../additional-learning-needs-screener/screenerDatePage'
import ChallengeCategory from '../../../server/enums/challengeCategory'
import ChallengeType from '../../../server/enums/challengeType'

export default class ChallengesPage extends ProfilePage {
  constructor() {
    super('profile-challenges')
    this.activeTabIs('Challenges')
  }

  clickAddChallengesButton(): SelectChallengeCategoryPage {
    this.addChallengeButton().click()
    return Page.verifyOnPage(SelectChallengeCategoryPage)
  }

  clickRecordAlnScreenerButton(): ScreenerDatePage {
    this.recordAlnScreenerButton().click()
    return Page.verifyOnPage(ScreenerDatePage)
  }

  private challengesActionItems = (): PageElement => cy.get('[data-qa=challenges-action-items] li')

  private addChallengeButton = (): PageElement => this.challengesActionItems().find('[data-qa=add-challenge-button]')

  private recordAlnScreenerButton = (): PageElement =>
    this.challengesActionItems().find('[data-qa=record-screener-results-button]')

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
