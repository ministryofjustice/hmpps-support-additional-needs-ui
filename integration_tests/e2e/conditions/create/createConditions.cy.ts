import Page from '../../../pages/page'
import SelectConditionsPage from '../../../pages/conditions/selectConditionsPage'
import OverviewPage from '../../../pages/profile/overviewPage'
import ConditionsPage from '../../../pages/profile/conditionsPage'
import ConditionType from '../../../../server/enums/conditionType'
import ConditionsDetailsPage from '../../../pages/conditions/conditionsDetailsPage'
import { postRequestedFor } from '../../../mockApis/wiremock/requestPatternBuilder'
import { urlEqualTo } from '../../../mockApis/wiremock/matchers/url'
import { matchingJsonPath } from '../../../mockApis/wiremock/matchers/content'
import ConditionSource from '../../../../server/enums/conditionSource'

describe('Create Conditions', () => {
  const prisonNumber = 'A00001A' // This prisoner is Abby Kyriakopoulos

  beforeEach(() => {
    cy.task('reset')
    cy.task('getPrisonerById', prisonNumber)
    cy.task('stubGetEducationSupportPlanCreationSchedules', { prisonNumber })
    cy.task('stubCreateConditions', prisonNumber)
    cy.task('stubGetConditions', { prisonNumber })
  })

  it('should be able to navigate directly to the create Conditions page', () => {
    // Given
    cy.task('stubSignIn')
    cy.signIn()

    // When
    cy.visit(`/conditions/${prisonNumber}/create/select-conditions`)

    // Then
    Page.verifyOnPage(SelectConditionsPage)
  })

  it('should create a prisoners self-declared Conditions, triggering validation on every screen given user does not have permission to create diagnosed conditions', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SOME_OTHER_ROLE'] }) // user has some DPS roles, but not the specific role that gives them permission to create diagnosed conditions
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Conditions', ConditionsPage)
      .clickAddConditionsButton()

    // When
    Page.verifyOnPage(SelectConditionsPage) //
      .hasPageHeading('What self-declared condition do you want to record for Abby Kyriakopoulos?')
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(SelectConditionsPage)
      .hasErrorCount(1)
      .hasFieldInError('conditions')
      // select Conditions but do not complete conditionally displayed fields
      .selectCondition(ConditionType.ADHD) // does not display a conditional field
      .selectCondition(ConditionType.VISUAL_IMPAIR) // does display a conditional field
      .selectCondition(ConditionType.LONG_TERM_OTHER) // does display a conditional field
      .submitPageTo(SelectConditionsPage)
      .hasErrorCount(2)
      .hasFieldInError('VISUAL_IMPAIR_conditionNames')
      .hasFieldInError('LONG_TERM_OTHER_conditionNames')
      // specify the conditions in the conditional fields
      .specifyCondition(ConditionType.VISUAL_IMPAIR, 'Colour blindness')
      .specifyCondition(ConditionType.LONG_TERM_OTHER, 'Arthritis')
      .submitPageTo(ConditionsDetailsPage)

    Page.verifyOnPage(ConditionsDetailsPage)
      // submit the page without answering the questions to trigger a validation error
      .submitPageTo(ConditionsDetailsPage)
      .hasErrorCount(3)
      .hasFieldInError('ADHD_details')
      .hasFieldInError('VISUAL_IMPAIR_details')
      .hasFieldInError('LONG_TERM_OTHER_details')
      // enter the condition details
      .enterConditionDetails(
        ConditionType.ADHD,
        'Has trouble concentrating and sitting still for long periods. Easily distracted.',
      )
      .enterConditionDetails(ConditionType.VISUAL_IMPAIR, 'Has red-green colour blindness.')
      .enterConditionDetails(ConditionType.LONG_TERM_OTHER, 'Acute arthritis in the right arm and hand. Cause unknown.')
      .submitPageTo(ConditionsPage)

    // Then
    Page.verifyOnPage(ConditionsPage).hasSuccessMessage('Condition(s) updated')

    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/conditions`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              '@.conditions.size() == 3 && ' +
              "@.conditions[0].prisonId == 'BXI' && " +
              "@.conditions[0].conditionTypeCode == 'ADHD' && " +
              "@.conditions[0].source == 'SELF_DECLARED' && " +
              '!@.conditions[0].conditionName && ' +
              "@.conditions[0].conditionDetails == 'Has trouble concentrating and sitting still for long periods. Easily distracted.' && " +
              "@.conditions[1].prisonId == 'BXI' && " +
              "@.conditions[1].conditionTypeCode == 'VISUAL_IMPAIR' && " +
              "@.conditions[1].source == 'SELF_DECLARED' && " +
              "@.conditions[1].conditionName == 'Colour blindness' && " +
              "@.conditions[1].conditionDetails == 'Has red-green colour blindness.' && " +
              "@.conditions[2].prisonId == 'BXI' && " +
              "@.conditions[2].conditionTypeCode == 'LONG_TERM_OTHER' && " +
              "@.conditions[2].source == 'SELF_DECLARED' && " +
              "@.conditions[2].conditionName == 'Arthritis' && " +
              "@.conditions[2].conditionDetails == 'Acute arthritis in the right arm and hand. Cause unknown.' " +
              ')]',
          ),
        ),
    )
  })

  it('should create a prisoners Conditions, triggering validation on every screen given user has permission to create diagnosed conditions', () => {
    // Given
    cy.task('stubSignIn', { roles: ['ROLE_SAN_EDUCATION_MANAGER'] }) // user has the role that gives them permission to create diagnosed conditions
    cy.signIn()

    cy.visit(`/profile/${prisonNumber}/overview`)
    Page.verifyOnPage(OverviewPage) //
      .selectTab('Conditions', ConditionsPage)
      .clickAddConditionsButton()

    // When
    Page.verifyOnPage(SelectConditionsPage) //
      .hasPageHeading('What self-declared or diagnosed condition do you want to record for Abby Kyriakopoulos?')
      // submit the page without answering the question to trigger a validation error
      .submitPageTo(SelectConditionsPage)
      .hasErrorCount(1)
      .hasFieldInError('conditions')
      // select Conditions but do not complete conditionally displayed fields
      .selectCondition(ConditionType.ADHD) // does not display a conditional field
      .selectCondition(ConditionType.VISUAL_IMPAIR) // does display a conditional field
      .selectCondition(ConditionType.LONG_TERM_OTHER) // does display a conditional field
      .submitPageTo(SelectConditionsPage)
      .hasErrorCount(2)
      .hasFieldInError('VISUAL_IMPAIR_conditionNames')
      .hasFieldInError('LONG_TERM_OTHER_conditionNames')
      // specify the conditions in the conditional fields
      .specifyCondition(ConditionType.VISUAL_IMPAIR, 'Colour blindness')
      .specifyCondition(ConditionType.LONG_TERM_OTHER, 'Arthritis')
      .submitPageTo(ConditionsDetailsPage)

    Page.verifyOnPage(ConditionsDetailsPage)
      // submit the page without answering the questions to trigger a validation error
      .submitPageTo(ConditionsDetailsPage)
      .hasErrorCount(6)
      .hasFieldInError('ADHD_details')
      .hasFieldInError('conditionDiagnosis[ADHD]')
      .hasFieldInError('VISUAL_IMPAIR_details')
      .hasFieldInError('conditionDiagnosis[VISUAL_IMPAIR]')
      .hasFieldInError('LONG_TERM_OTHER_details')
      .hasFieldInError('conditionDiagnosis[LONG_TERM_OTHER]')
      // enter the condition details, but without the diagnosis sources, so will still trigger a validation error
      .enterConditionDetails(
        ConditionType.ADHD,
        'Has trouble concentrating and sitting still for long periods. Easily distracted.',
      )
      .enterConditionDetails(ConditionType.VISUAL_IMPAIR, 'Has red-green colour blindness.')
      .enterConditionDetails(ConditionType.LONG_TERM_OTHER, 'Acute arthritis in the right arm and hand. Cause unknown.')
      .submitPageTo(ConditionsDetailsPage)
      .hasErrorCount(3)
      .hasFieldInError('conditionDiagnosis[ADHD]')
      .hasFieldInError('conditionDiagnosis[VISUAL_IMPAIR]')
      .hasFieldInError('conditionDiagnosis[LONG_TERM_OTHER]')
      // select the condition diagnosis sources
      .selectHowConditionWasDiagnosed(ConditionType.ADHD, ConditionSource.SELF_DECLARED)
      .selectHowConditionWasDiagnosed(ConditionType.VISUAL_IMPAIR, ConditionSource.CONFIRMED_DIAGNOSIS)
      .selectHowConditionWasDiagnosed(ConditionType.LONG_TERM_OTHER, ConditionSource.CONFIRMED_DIAGNOSIS)
      .submitPageTo(ConditionsPage)

    // Then
    Page.verifyOnPage(ConditionsPage).hasSuccessMessage('Condition(s) updated')

    cy.wiremockVerify(
      postRequestedFor(urlEqualTo(`/support-additional-needs-api/profile/${prisonNumber}/conditions`)) //
        .withRequestBody(
          matchingJsonPath(
            '$[?(' +
              '@.conditions.size() == 3 && ' +
              "@.conditions[0].prisonId == 'BXI' && " +
              "@.conditions[0].conditionTypeCode == 'ADHD' && " +
              "@.conditions[0].source == 'SELF_DECLARED' && " +
              '!@.conditions[0].conditionName && ' +
              "@.conditions[0].conditionDetails == 'Has trouble concentrating and sitting still for long periods. Easily distracted.' && " +
              "@.conditions[1].prisonId == 'BXI' && " +
              "@.conditions[1].conditionTypeCode == 'VISUAL_IMPAIR' && " +
              "@.conditions[1].source == 'CONFIRMED_DIAGNOSIS' && " +
              "@.conditions[1].conditionName == 'Colour blindness' && " +
              "@.conditions[1].conditionDetails == 'Has red-green colour blindness.' && " +
              "@.conditions[2].prisonId == 'BXI' && " +
              "@.conditions[2].conditionTypeCode == 'LONG_TERM_OTHER' && " +
              "@.conditions[2].source == 'CONFIRMED_DIAGNOSIS' && " +
              "@.conditions[2].conditionName == 'Arthritis' && " +
              "@.conditions[2].conditionDetails == 'Acute arthritis in the right arm and hand. Cause unknown.' " +
              ')]',
          ),
        ),
    )
  })

  it('should not create Conditions given API returns an error response', () => {
    // Given
    cy.task('stubSignIn')
    cy.signIn()

    cy.task('stubCreateConditions500Error', prisonNumber)

    cy.visit(`/conditions/${prisonNumber}/create/select-conditions`)

    Page.verifyOnPage(SelectConditionsPage) //
      .selectCondition(ConditionType.ADHD)
      .submitPageTo(ConditionsDetailsPage)
      .enterConditionDetails(
        ConditionType.ADHD,
        'Has trouble concentrating and sitting still for long periods. Easily distracted.',
      )

    // When
    Page.verifyOnPage(ConditionsDetailsPage) //
      .apiErrorBannerIsNotDisplayed()
    Page.verifyOnPage(ConditionsDetailsPage) //
      .submitPageTo(ConditionsDetailsPage) // Submit the page but expect to stay on the Add Conditions Detail page due to API error

    // Then
    Page.verifyOnPage(ConditionsDetailsPage) //
      .apiErrorBannerIsDisplayed()
  })
})
