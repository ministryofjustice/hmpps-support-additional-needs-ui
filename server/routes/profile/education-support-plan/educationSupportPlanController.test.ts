import { Request, Response } from 'express'
import EducationSupportPlanController from './educationSupportPlanController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidEducationSupportPlanDto from '../../../testsupport/educationSupportPlanDtoTestDataBuilder'
import aPlanLifecycleStatusDto from '../../../testsupport/planLifecycleStatusDtoTestDataBuilder'
import { Result } from '../../../utils/result/result'

describe('educationSupportPlanController', () => {
  const controller = new EducationSupportPlanController()

  const prisonerSummary = aValidPrisonerSummary()
  const educationSupportPlan = Result.fulfilled(aValidEducationSupportPlanDto())
  const educationSupportPlanLifecycleStatus = Result.fulfilled(aPlanLifecycleStatusDto())

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, educationSupportPlan, educationSupportPlanLifecycleStatus },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/education-support-plan/index'
    const expectedViewModel = {
      prisonerSummary,
      educationSupportPlan,
      educationSupportPlanLifecycleStatus,
      tab: 'education-support-plan',
    }

    // When
    await controller.getEducationSupportPlanView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
