import type { Request, RequestHandler, Response } from 'express';

import { handleServiceResponse } from '../../common/utils/httpHandlers';
import { assetService } from './assetService';

class AssetController {
    public uploadFile: RequestHandler = async (req: Request, res: Response) => {
        const serviceResponse = await assetService.uploadFile(req.file!);
        return handleServiceResponse(serviceResponse, res);
    };
}

export const assetController = new AssetController();
