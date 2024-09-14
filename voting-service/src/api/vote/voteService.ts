import { StatusCodes } from "http-status-codes";

import type { Vote } from "./voteModel";
import { ServiceResponse } from "../../common/models/serviceResponse";
import { logger } from "../../server";

export class VoteService {
  async findAll(): Promise<ServiceResponse<Vote[] | null>> {
    try {
      // Do something here

      return ServiceResponse.success<Vote[]>("Vote found", []);
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

export const voteService = new VoteService();
