import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "../../api-docs/openAPIResponseBuilders";
import { AssetSchema } from "./assetModel";
import { assetController } from "./assetController";

export const assetRegistry = new OpenAPIRegistry();
export const assetRouter: Router = express.Router();

assetRegistry.register("Asset", AssetSchema);

assetRegistry.registerPath({
  method: "get",
  path: "/asset",
  tags: ["Asset"],
  responses: createApiResponse(z.array(AssetSchema), "Success"),
});

assetRouter.get("/", assetController.getAssets);
