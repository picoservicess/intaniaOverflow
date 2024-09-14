import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "../../api-docs/openAPIResponseBuilders";
import { VoteSchema } from "./voteModel";
import { voteController } from "./voteController";

export const voteRegistry = new OpenAPIRegistry();
export const voteRouter: Router = express.Router();

voteRegistry.register("User", VoteSchema);

voteRegistry.registerPath({
  method: "get",
  path: "/vote",
  tags: ["Vote"],
  responses: createApiResponse(z.array(VoteSchema), "Success"),
});

voteRouter.get("/", voteController.getVotes);
