import { Request, Response } from 'express'
import ConditionsController from './conditionsController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { aValidConditionsList } from '../../../testsupport/conditionDtoTestDataBuilder'
import { Result } from '../../../utils/result/result'
import aPlanLifecycleStatusDto from '../../../testsupport/planLifecycleStatusDtoTestDataBuilder'

describe('conditionsController', () => {
  const controller = new ConditionsController()

  const prisonerSummary = aValidPrisonerSummary()
  const conditions = Result.fulfilled(aValidConditionsList())
  const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }
  const educationSupportPlanLifecycleStatus = Result.fulfilled(aPlanLifecycleStatusDto())

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, conditions, prisonNamesById, educationSupportPlanLifecycleStatus },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/conditions/index'
    const expectedViewModel = {
      prisonerSummary,
      conditions,
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
      tab: 'conditions',
    }

    // When
    await controller.getConditionsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
