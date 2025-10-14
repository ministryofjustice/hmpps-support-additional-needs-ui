import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto, ReviewEducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'

export default class SpecificTeachingSkillsController {
  getSpecificTeachingSkillsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto, reviewEducationSupportPlanDto } = req.journeyData

    const currentAnswer = educationSupportPlanDto.specificTeachingSkillsNeeded
      ? educationSupportPlanDto.specificTeachingSkills
      : 'No'
    const specificTeachingSkillsForm =
      invalidForm ?? this.populateFormFromDto(reviewEducationSupportPlanDto, educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: specificTeachingSkillsForm, mode: 'review', currentAnswer }
    return res.render('pages/education-support-plan/specific-teaching-skills/index', viewRenderArgs)
  }

  submitSpecificTeachingSkillsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const specificTeachingSkillsForm = { ...req.body }
    this.updateDtoFromForm(req, specificTeachingSkillsForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'exam-arrangements' : 'check-your-answers')
  }

  private populateFormFromDto = (
    reviewEducationSupportPlanDto: ReviewEducationSupportPlanDto,
    educationSupportPlanDto: EducationSupportPlanDto,
  ) => {
    const dtoToBaseFormOn: EducationSupportPlanDto | ReviewEducationSupportPlanDto =
      reviewEducationSupportPlanDto.specificTeachingSkillsNeeded != null
        ? reviewEducationSupportPlanDto
        : educationSupportPlanDto
    return {
      skillsRequired: dtoToBaseFormOn.specificTeachingSkillsNeeded ? YesNoValue.YES : YesNoValue.NO,
      details: dtoToBaseFormOn.specificTeachingSkills,
    }
  }

  private updateDtoFromForm = (req: Request, form: { skillsRequired: YesNoValue; details?: string }) => {
    const { reviewEducationSupportPlanDto } = req.journeyData
    reviewEducationSupportPlanDto.specificTeachingSkillsNeeded = form.skillsRequired === YesNoValue.YES
    reviewEducationSupportPlanDto.specificTeachingSkills = form.details
    req.journeyData.reviewEducationSupportPlanDto = reviewEducationSupportPlanDto
  }
}
