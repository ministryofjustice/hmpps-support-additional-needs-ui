import { Request, Response } from 'express'
import OverviewController from './overviewController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidPlanCreationScheduleDto from '../../../testsupport/planCreationScheduleDtoTestDataBuilder'
import { Result } from '../../../utils/result/result'

describe('overviewController', () => {
  const controller = new OverviewController()

  const prisonerSummary = aValidPrisonerSummary()
  const educationSupportPlanCreationSchedule = Result.fulfilled(aValidPlanCreationScheduleDto())

  const req = {} as unknown as Request
  const res = {
    render: jest.fn(),
    locals: { prisonerSummary, educationSupportPlanCreationSchedule },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/overview/index'
    const expectedViewModel = {
      prisonerSummary,
      educationSupportPlanCreationSchedule,
      tab: 'overview',
    }

    // When
    await controller.getOverviewView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
