import { Request, Response } from "express";

class NpsController {
  /*
    1 2 3 4 5 6 7 8 9
    Detratores => 8 -  6
    Passivos   => 7 -  8
    Promotores => 9 - 10

    Calc. NPS = (((Num. Promotores - Num. Detratores) / Num. Respondentes) * 100)
  */

  async execute(request: Request, response: Response) {

  }
}

export { NpsController };