import ProfilePage from './profilePage'
import { PageElement } from '../page'
import StrengthCategory from '../../../server/enums/strengthCategory'
import StrengthType from '../../../server/enums/strengthType'

export default class StrengthsPage extends ProfilePage {
  constructor() {
    super('profile-strengths')
    this.activeTabIs('Strengths')
  }

  hasStrengthsSummaryCard(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard(category).should('be.visible')
    return this
  }

  hasNonAlnStrengths(category: StrengthCategory, ...strengthType: Array<StrengthType>): StrengthsPage {
    strengthType.forEach(strength =>
      this.strengthCategorySummaryCard(category).find(`[data-qa=${strength}].non-aln-strength`).should('be.visible'),
    )
    return this
  }

  hasNoNonAlnStrengths(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard(category).find(`.non-aln-strength`).should('not.exist')
    return this
  }

  hasAlnStrengths(category: StrengthCategory, ...strengths: Array<string>): StrengthsPage {
    this.strengthCategorySummaryCard(category)
      .find(`.aln-strengths li`)
      .then(listItems => {
        cy.wrap(listItems).should('have.length', strengths.length)
        listItems.each((index, element) => {
          cy.wrap(element).should('contain.text', strengths[index])
        })
      })
    return this
  }

  hasNoAlnStrengths(category: StrengthCategory): StrengthsPage {
    this.strengthCategorySummaryCard(category).find('.aln-strengths').should('not.exist')
    return this
  }

  hasNoActiveStrengths(): StrengthsPage {
    this.noStrengthsSummaryCard().should('be.visible')
    return this
  }

  private noStrengthsSummaryCard = (): PageElement => cy.get('[data-qa=no-strengths-summary-card]')

  private strengthCategorySummaryCard = (category: StrengthCategory): PageElement =>
    cy.get(`[data-qa=strengths-summary-card_${category}]`)
}
