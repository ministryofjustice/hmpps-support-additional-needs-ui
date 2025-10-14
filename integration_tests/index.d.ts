declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to signIn. Set failOnStatusCode to false if you expect and non 200 return code
     * @example cy.signIn({ failOnStatusCode: boolean })
     */
    signIn(options?: { failOnStatusCode: boolean }): Chainable<AUTWindow>

    wiremockVerify(requestPatternBuilder: RequestPatternBuilder, expectedCount?: number): Chainable<*>

    wiremockVerifyNoInteractions(requestPatternBuilder: RequestPatternBuilder): Chainable<*>

    createEducationSupportPlanToArriveOnCheckYourAnswers(options?: { prisonNumber?: string; reviewDate?: Date })

    recordAlnScreenerToArriveOnCheckYourAnswers(options?: { prisonNumber?: string; screenerDate?: Date })

    recordEducationSupportPlanReviewToArriveOnCheckYourAnswers(options?: { prisonNumber?: string; reviewDate?: Date })
  }
}
