import ProfilePage from './profilePage'
import Page, { PageElement } from '../page'
import ChallengeCategory from '../../../server/enums/challengeCategory'
import ChallengeType from '../../../server/enums/challengeType'
import ChallengeDetailPage from '../challenges/challengeDetailPage'
import zeroIndexed from '../../utils/zeroIndexed'
import ArchiveChallengeReasonPage from '../challenges/archiveChallengeReasonPage'
import DeleteChallengeReasonPage from '../challenges/deleteChallengeReasonPage'
import DeleteAlnScreenerReasonPage from '../additional-learning-needs-screener/deleteAlnScreenerReasonPage'
import SupportStrategyType from '../../../server/enums/supportStrategyType'
import SupportStrategyDetailPage from '../support-strategies/supportStrategyDetailPage'
import ArchiveSupportStrategyReasonPage from '../support-strategies/archiveSupportStrategyReasonPage'
import DeleteSupportStrategyReasonPage from '../support-strategies/deleteSupportStrategyReasonPage'

export default class ChallengesAndSupportPage extends ProfilePage {
  constructor() {
    super('profile-challenges-and-support')
    this.activeTabIs('Challenges and support')
  }

  clickToEditNthNonAlnChallenge(index: number): ChallengeDetailPage {
    this.nonAlnChallenges().eq(zeroIndexed(index)).find('[data-qa=edit-challenge-button]').click()
    return Page.verifyOnPage(ChallengeDetailPage)
  }

  clickToArchiveNthNonAlnChallenge(index: number): ArchiveChallengeReasonPage {
    this.nonAlnChallenges().eq(zeroIndexed(index)).find('[data-qa=archive-challenge-button]').click()
    return Page.verifyOnPage(ArchiveChallengeReasonPage)
  }

  clickToDeleteNthNonAlnChallenge(index: number): DeleteChallengeReasonPage {
    this.nonAlnChallenges().eq(zeroIndexed(index)).find('[data-qa=delete-challenge-button]').click()
    return Page.verifyOnPage(DeleteChallengeReasonPage)
  }

  doesNotHaveDeleteChallengeButton(): ChallengesAndSupportPage {
    cy.get('[data-qa=delete-challenge-button]').should('not.exist')
    return this
  }

  clickToDeleteAlnScreener(): DeleteAlnScreenerReasonPage {
    cy.get('[data-qa=delete-aln-screener-button]').first().click()
    return Page.verifyOnPage(DeleteAlnScreenerReasonPage)
  }

  doesNotHaveDeleteAlnScreenerButton(): ChallengesAndSupportPage {
    cy.get('[data-qa=delete-aln-screener-button]').should('not.exist')
    return this
  }

  clickHistoryTab(): ChallengesAndSupportPage {
    cy.get('a.govuk-tabs__tab[href="#archived-challenges-and-support"]').click()
    return this
  }

  clickToDeleteNthArchivedChallenge(index: number): DeleteChallengeReasonPage {
    this.archivedChallenges().eq(zeroIndexed(index)).find('[data-qa=delete-archived-challenge-button]').click()
    return Page.verifyOnPage(DeleteChallengeReasonPage)
  }

  doesNotHaveDeleteArchivedChallengeButton(): ChallengesAndSupportPage {
    cy.get('[data-qa=delete-archived-challenge-button]').should('not.exist')
    return this
  }

  hasActiveChallengesSummaryCard(category: ChallengeCategory): ChallengesAndSupportPage {
    this.challengesAndSupportCategorySummaryCard({ category, active: true }).should('be.visible')
    return this
  }

  hasArchivedChallengesSummaryCard(category: ChallengeCategory): ChallengesAndSupportPage {
    this.challengesAndSupportCategorySummaryCard({ category, active: false }).should('be.visible')
    return this
  }

  hasNoActiveChallengesSummaryCard(category: ChallengeCategory): ChallengesAndSupportPage {
    this.challengesAndSupportCategorySummaryCard({ category, active: true }).should('not.exist')
    return this
  }

  hasNoArchivedChallengesSummaryCard(category: ChallengeCategory): ChallengesAndSupportPage {
    this.challengesAndSupportCategorySummaryCard({ category, active: false }).should('not.exist')
    return this
  }

  hasActiveNonAlnChallenges(
    category: ChallengeCategory,
    ...challengeType: Array<ChallengeType>
  ): ChallengesAndSupportPage {
    challengeType.forEach(challenge =>
      this.challengesAndSupportCategorySummaryCard({ category, active: true })
        .find(`.non-aln-challenge[data-qa=non-aln-challenge-${challenge}]`)
        .should('be.visible'),
    )
    return this
  }

  hasArchivedNonAlnChallenges(
    category: ChallengeCategory,
    ...challengeType: Array<ChallengeType>
  ): ChallengesAndSupportPage {
    challengeType.forEach(challenge =>
      this.challengesAndSupportCategorySummaryCard({ category, active: false })
        .find(`.non-aln-challenge[data-qa=${challenge}]`)
        .should('be.visible'),
    )
    return this
  }

  hasNoActiveNonAlnChallenges(category: ChallengeCategory): ChallengesAndSupportPage {
    this.challengesAndSupportCategorySummaryCard({ category, active: true })
      .find('.non-aln-challenge')
      .should('not.exist')
    return this
  }

  hasNoArchivedNonAlnChallenges(category: ChallengeCategory): ChallengesAndSupportPage {
    this.challengesAndSupportCategorySummaryCard({ category, active: false })
      .find('.non-aln-challenge')
      .should('not.exist')
    return this
  }

  hasActiveAlnChallenges(category: ChallengeCategory, ...challenges: Array<string>): ChallengesAndSupportPage {
    this.challengesAndSupportCategorySummaryCard({ category, active: true })
      .find('.aln-challenges li')
      .then(listItems => {
        cy.wrap(listItems).should('have.length', challenges.length)
        listItems.each((index, element) => {
          cy.wrap(element).should('contain.text', challenges[index])
        })
      })
    return this
  }

  hasArchivedAlnChallenges(category: ChallengeCategory, ...challenges: Array<string>): ChallengesAndSupportPage {
    this.challengesAndSupportCategorySummaryCard({ category, active: false })
      .find('.aln-challenges li')
      .then(listItems => {
        cy.wrap(listItems).should('have.length', challenges.length)
        listItems.each((index, element) => {
          cy.wrap(element).should('contain.text', challenges[index])
        })
      })
    return this
  }

  hasNoActiveAlnChallenges(category: ChallengeCategory): ChallengesAndSupportPage {
    this.challengesAndSupportCategorySummaryCard({ category, active: true }).find('.aln-challenges').should('not.exist')
    return this
  }

  hasNoArchivedAlnChallenges(category: ChallengeCategory): ChallengesAndSupportPage {
    this.challengesAndSupportCategorySummaryCard({ category, active: false })
      .find('.aln-challenges')
      .should('not.exist')
    return this
  }

  hasNoActiveChallenges(): ChallengesAndSupportPage {
    this.noChallengesMessage({ active: true }).should('be.visible')
    return this
  }

  hasNoArchivedChallenges(): ChallengesAndSupportPage {
    this.noChallengesMessage({ active: false }).should('be.visible')
    return this
  }

  clickToEditNthSupportStrategy(index: number): SupportStrategyDetailPage {
    this.supportStrategies().eq(zeroIndexed(index)).find('[data-qa=edit-support-strategy-button]').click()
    return Page.verifyOnPage(SupportStrategyDetailPage)
  }

  clickToArchiveNthSupportStrategy(index: number): ArchiveSupportStrategyReasonPage {
    this.supportStrategies().eq(zeroIndexed(index)).find('[data-qa=archive-support-strategy-button]').click()
    return Page.verifyOnPage(ArchiveSupportStrategyReasonPage)
  }

  clickToDeleteNthSupportStrategy(index: number): DeleteSupportStrategyReasonPage {
    this.supportStrategies().eq(zeroIndexed(index)).find('[data-qa=delete-support-strategy-button]').click()
    return Page.verifyOnPage(DeleteSupportStrategyReasonPage)
  }

  doesNotHaveDeleteSupportStrategyButton(): ChallengesAndSupportPage {
    cy.get('[data-qa=delete-support-strategy-button]').should('not.exist')
    return this
  }

  clickToDeleteNthArchivedSupportStrategy(index: number): DeleteSupportStrategyReasonPage {
    this.archivedSupportStrategies()
      .eq(zeroIndexed(index))
      .find('[data-qa=delete-archived-support-strategy-button]')
      .click()
    return Page.verifyOnPage(DeleteSupportStrategyReasonPage)
  }

  doesNotHaveDeleteArchivedSupportStrategyButton(): ChallengesAndSupportPage {
    cy.get('[data-qa=delete-archived-support-strategy-button]').should('not.exist')
    return this
  }

  hasActiveSupportStrategySummaryCard(category: SupportStrategyType): ChallengesAndSupportPage {
    this.challengesAndSupportCategorySummaryCard({ category, active: true }).should('be.visible')
    return this
  }

  hasNoActiveSupportStrategies(): ChallengesAndSupportPage {
    this.noSupportStrategiesMessage({ active: true }).should('be.visible')
    return this
  }

  private noChallengesMessage = (options: { active: boolean }): PageElement =>
    cy.get(`[data-qa=no-${options.active ? 'active' : 'archived'}-challenges-message]`)

  private challengesAndSupportCategorySummaryCard = (options: { category: string; active: boolean }): PageElement =>
    cy.get(
      `[data-qa=${options.active ? 'active' : 'archived'}-challenges-and-support-summary-card-${options.category}]`,
    )

  private nonAlnChallenges = (): PageElement => cy.get('.govuk-summary-list__row.non-aln-challenge')

  private archivedChallenges = (): PageElement => cy.get('.govuk-summary-list__row.archived-challenge')

  private noSupportStrategiesMessage = (options: { active: boolean }): PageElement =>
    cy.get(`[data-qa=no-${options.active ? 'active' : 'archived'}-support-strategies-message]`)

  private supportStrategies = (): PageElement => cy.get('.govuk-summary-list__row.support-strategy')

  private archivedSupportStrategies = (): PageElement => cy.get('.govuk-summary-list__row.archived-support-strategy')
}
