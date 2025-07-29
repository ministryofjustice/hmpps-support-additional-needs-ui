import { Request, Response } from 'express'
import type { ConditionsList } from 'dto'
import SelectConditionsController from './selectConditionsController'
import { aValidConditionDto } from '../../../../testsupport/conditionDtoTestDataBuilder'
import ConditionType from '../../../../enums/conditionType'
import ConditionSource from '../../../../enums/conditionSource'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('selectConditionsController', () => {
  const controller = new SelectConditionsController()

  const username = 'A_USER'
  const prisonId = 'MDI'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const req = {
    session: {},
    user: { username },
    journeyData: {},
    body: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: {
      user: { activeCaseLoadId: prisonId },
      prisonerSummary,
    },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {
      conditionsList: {
        prisonNumber,
        conditions: [aValidConditionDto({ conditionTypeCode: ConditionType.ADHD })],
      },
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/conditions/select-conditions/index'
    const expectedViewModel = {
      form: {
        conditions: ['ADHD'],
      },
      prisonerSummary,
    }

    // When
    await controller.getSelectConditionsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      conditions: ['not-a-valid-value'],
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/conditions/select-conditions/index'
    const expectedViewModel = {
      form: invalidForm,
      prisonerSummary,
    }

    // When
    await controller.getSelectConditionsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
    // Given
    const conditionsList: ConditionsList = {
      prisonNumber,
      conditions: [],
    }
    req.journeyData = { conditionsList }
    req.body = {
      conditions: ['ADHD', 'OTHER'],
      conditionNames: { OTHER: 'Some other condition' },
    }

    const expectedConditionsList: ConditionsList = {
      prisonNumber,
      conditions: [
        {
          prisonId,
          conditionTypeCode: ConditionType.ADHD,
          conditionName: undefined,
          conditionDetails: undefined,
          source: ConditionSource.SELF_DECLARED,
        },
        {
          prisonId,
          conditionTypeCode: ConditionType.OTHER,
          conditionName: 'Some other condition',
          conditionDetails: undefined,
          source: ConditionSource.SELF_DECLARED,
        },
      ],
    }
    const expectedNextRoute = 'details'

    // When
    await controller.submitSelectConditionsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.conditionsList).toEqual(expectedConditionsList)
  })
})
