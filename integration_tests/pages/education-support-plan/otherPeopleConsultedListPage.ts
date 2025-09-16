import Page, { PageElement } from '../page'
import OtherPeopleConsultedAddPersonPage from './otherPeopleConsultedAddPersonPage'
import zeroIndexed from '../../utils/zeroIndexed'

export default class OtherPeopleConsultedListPage extends Page {
  constructor() {
    super('education-support-plan-other-people-consulted-list')
  }

  numberOfPeopleConsultedIs(expectedCount: number): OtherPeopleConsultedListPage {
    this.peopleConsultedListTable().find('[data-qa=person-consulted-name]').should('have.length', expectedCount)
    return this
  }

  personAtRowIs(row: number, expectedName: string, expectedJobRole: string): OtherPeopleConsultedListPage {
    this.peopleConsultedListTable()
      .find('[data-qa=person-consulted-name]')
      .eq(zeroIndexed(row))
      .should('contain.text', expectedName)
    this.peopleConsultedListTable()
      .find('[data-qa=person-consulted-job-role]')
      .eq(zeroIndexed(row))
      .should('contain.text', expectedJobRole)

    return this
  }

  clickToAddAnotherPerson(): OtherPeopleConsultedAddPersonPage {
    this.addAnotherPersonButton().click()
    return Page.verifyOnPage(OtherPeopleConsultedAddPersonPage)
  }

  removePerson<T extends Page>(row: number, expected: new () => T): T {
    this.peopleConsultedListTable()
      .find(`button[name=removePerson][value=${zeroIndexed(row)}]`)
      .click()
    return Page.verifyOnPage(expected)
  }

  private peopleConsultedListTable = (): PageElement => cy.get('[data-qa=people-consulted-table')

  private addAnotherPersonButton = (): PageElement => cy.get('#addPerson')
}
