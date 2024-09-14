import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "../../api-docs/openAPIResponseBuilders";
import { ThreadSchema } from "./threadModel";
import { threadController } from "./threadController";

export const threadRegistry = new OpenAPIRegistry();
export const threadRouter: Router = express.Router();

threadRegistry.register("Thread", ThreadSchema);

threadRegistry.registerPath({
  method: "get",
  path: "/thread",
  tags: ["Thread"],
  responses: createApiResponse(z.array(ThreadSchema), "Success"),
});

threadRouter.get("/", threadController.getThreads);
