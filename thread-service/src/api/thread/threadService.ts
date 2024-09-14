import { StatusCodes } from "http-status-codes";

import type { Thread } from "./threadModel";
import { ServiceResponse } from "../../common/models/serviceResponse";
import { logger } from "../../server";

export class ThreadService {
  async findAll(): Promise<ServiceResponse<Thread[] | null>> {
    try {
      return ServiceResponse.success<Thread[]>("Users found", []);
    } catch (error) {
      const errorMessage = `Error finding all thread: $${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving users.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const threadService = new ThreadService();
