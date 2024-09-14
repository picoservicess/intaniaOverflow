import type { Request, RequestHandler, Response } from "express";

import { threadService } from "./threadService";
import { handleServiceResponse } from "../../common/utils/httpHandlers";

class ThreadController {
  public getThreads: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await threadService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };
}

export const threadController = new ThreadController();
