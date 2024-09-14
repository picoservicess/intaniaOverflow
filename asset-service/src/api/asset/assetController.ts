import type { Request, RequestHandler, Response } from "express";

import { assetService } from "./assetService";
import { handleServiceResponse } from "../../common/utils/httpHandlers";

class AssetController {
  public getAssets: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await assetService.findAll();
    return handleServiceResponse(serviceResponse, res);
  };
}

export const assetController = new AssetController();
