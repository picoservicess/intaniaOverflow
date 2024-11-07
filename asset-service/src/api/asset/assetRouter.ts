import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import multer from "multer";
import { z } from "zod";

import { authenticateToken } from "@/middleware/auth";

import { createApiResponse } from "../../api-docs/openAPIResponseBuilders";
import { assetController } from "./assetController";
import { AssetSchema } from "./assetModel";

export const assetRegistry = new OpenAPIRegistry();
export const assetRouter: Router = express.Router();
const upload = multer();

assetRegistry.register("Asset", AssetSchema);

assetRegistry.registerPath({
    method: "post",
    path: "/asset/upload",
    tags: ["Asset"],
    request: {
        body: {
            content: {
                "multipart/form-data": {
                    schema: z.object({
                        file: z.any().openapi({
                            type: "string",
                            format: "binary",
                        }),
                    }),
                },
            },
        },
    },
    responses: createApiResponse(z.array(AssetSchema), "Success"),
});

assetRouter.post(
    "/upload",
    authenticateToken,
    upload.single("file"),
    assetController.uploadFile
);
