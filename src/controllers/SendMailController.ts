import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import { resolve } from "path";
import SendMailService from "../services/SendMailService";

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;
    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if (!user) {
      return response.status(400).json({
        erro: "User does not exists!"
      })
    }

    const survey = await surveysRepository.findOne({ id: survey_id })

    if (!survey) {
      return response.status(400).json({
        error: "Survey does not exists!"
      })
    }

    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");
    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      user_id: user.id,
      link: process.env.URL_MAIL
    };

    // Caso exista uma pesquisa já enviada mas sem retorno do usuário, 
    // envia novamente a mesma pesquisa, sem criar um novo registro de pesquisa
    // para não poluir o BD
    const surveysUserExists = await surveysUsersRepository.findOne({
      where: [{ user_id: user.id }, { survey_id: survey.id }, { value: null }],
      relations: ["user", "survey"]
    });

    if (surveysUserExists) {
      await SendMailService.execute(email, survey.title, variables, npsPath);
      return response.json(surveysUserExists);
    }

    // Salvar as informações na tabela SurveysUsers
    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id
    })
    await surveysUsersRepository.save(surveyUser);

    // Enviar e-mail para o usuário 
    await SendMailService.execute(email, survey.title, variables, npsPath);

    return response.json(surveyUser);
  }
}

export { SendMailController };