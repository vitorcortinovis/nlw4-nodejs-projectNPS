import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {

  // htpp:localhost:3333/answer/1?u=e3a9c6ca-c7cd-4482-bca8-76c4f4c6548f
  /*
    Route Params => Parâmetros que compoe a rota
    Ex: routes.get("/answer/:value")

    Query Params => Busca, Paginação (Não obrigatórios, identificados a partir do "?")
    Ex: htpp:localhost:3333/answer/1?u=e3a9c6ca-c7cd-4482-bca8-76c4f4c6548f
  */

  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(u)
    });

    if (!surveyUser) {
      return response.status(400).json({
        error: "Survey User does not exists!"
      });
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { AnswerController };