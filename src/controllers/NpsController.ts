import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
  /*
    1 2 3 4 5 6 7 8 9
    Detratores => 8 -  6
    Passivos   => 7 -  8
    Promotores => 9 - 10

    Calc. NPS = (((Num. Promotores - Num. Detratores) / Num. Respondentes) * 100)
  */

  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
    const surveysUser = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull())
    });

    const detractor = surveysUser.filter(survey => (survey.value >= 0 && survey.value <= 6)).length;
    const promoters = surveysUser.filter(survey => (survey.value >= 9 && survey.value <= 10)).length;
    const passives = surveysUser.filter(survey => (survey.value >= 7 && survey.value <= 8)).length;

    const totalAnswer = surveysUser.length;

    const calculate = Number((((promoters - detractor) / totalAnswer) * 100).toFixed(2));

    return response.json({
      detractor,
      promoters,
      passives,
      totalAnswer,
      nps: calculate
    });
  }
}

export { NpsController };