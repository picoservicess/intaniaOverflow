import type { Request, RequestHandler, Response } from "express";

import { voteService } from "./voteService";
import { handleServiceResponse } from "../../common/utils/httpHandlers";

class VoteController {
  public getVotes: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await voteService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };
}

export const voteController = new VoteController();
