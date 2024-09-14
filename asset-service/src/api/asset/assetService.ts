import { StatusCodes } from "http-status-codes";

import type { Asset } from "./assetModel";
import { ServiceResponse } from "../../common/models/serviceResponse";
import { logger } from "../../server";

export class AssetService {
  async findAll(): Promise<ServiceResponse<Asset[] | null>> {
    try {
      return ServiceResponse.success<Asset[]>("Users found", []);
    } catch (error) {
      const errorMessage = `Error finding all assets: $${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving users.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const assetService = new AssetService();
