import Page, { PageElement } from '../page'

export default class ScreenerDatePage extends Page {
  constructor() {
    super('record-aln-screener-date')
  }

  setScreenerDate(screenerDate: string): ScreenerDatePage {
    this.screenerDateField().clear().type(screenerDate, { delay: 0 })
    return this
  }

  private screenerDateField = (): PageElement => cy.get('#screenerDate')
}
