import { Request, Response } from 'express'
import aValidAlnScreenerDto from '../../../../testsupport/alnScreenerDtoTestDataBuilder'
import AddChallengesController from './addChallengesController'
import ChallengeType from '../../../../enums/challengeType'

describe('addChallengesController', () => {
  const controller = new AddChallengesController()

  const req = {
    session: {},
    journeyData: {},
    body: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    render: jest.fn(),
    locals: {},
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = {
      alnScreenerDto: aValidAlnScreenerDto({ challenges: [ChallengeType.ARITHMETIC, ChallengeType.MATHS_CONFIDENCE] }),
    }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/additional-learning-needs-screener/add-challenges/index'
    const expectedViewModel = {
      form: {
        challengeTypeCodes: ['ARITHMETIC', 'MATHS_CONFIDENCE'],
      },
    }

    // When
    await controller.getAddChallengesView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      challengeTypeCodes: 'not-a-valid-value',
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/additional-learning-needs-screener/add-challenges/index'
    const expectedViewModel = { form: invalidForm }

    // When
    await controller.getAddChallengesView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route given previous page was not check your answers', async () => {
    // Given
    req.query = {}
    req.journeyData = { alnScreenerDto: aValidAlnScreenerDto({ challenges: null }) }
    req.body = {
      challengeTypeCodes: ['ARITHMETIC', 'MATHS_CONFIDENCE'],
    }

    const expectedNextRoute = 'add-strengths'
    const expectedAlnScreenerDto = aValidAlnScreenerDto({
      challenges: [ChallengeType.ARITHMETIC, ChallengeType.MATHS_CONFIDENCE],
    })

    // When
    await controller.submitAddChallengesForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.alnScreenerDto).toEqual(expectedAlnScreenerDto)
  })

  it('should submit form and redirect to next route given previous page was check your answers', async () => {
    // Given
    req.query = { submitToCheckAnswers: 'true' }
    req.journeyData = { alnScreenerDto: aValidAlnScreenerDto({ challenges: [ChallengeType.NONE] }) }
    req.body = {
      challengeTypeCodes: ['ARITHMETIC', 'MATHS_CONFIDENCE'],
    }

    const expectedNextRoute = 'check-your-answers'
    const expectedAlnScreenerDto = aValidAlnScreenerDto({
      challenges: [ChallengeType.ARITHMETIC, ChallengeType.MATHS_CONFIDENCE],
    })

    // When
    await controller.submitAddChallengesForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.alnScreenerDto).toEqual(expectedAlnScreenerDto)
  })
})
