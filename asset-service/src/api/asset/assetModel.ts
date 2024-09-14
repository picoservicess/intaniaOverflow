import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type Asset = z.infer<typeof AssetSchema>;

export const AssetSchema = z.object({
  id: z.number(),
  url: z.string(),
});

export const GetAssetSchema = z.object({
  params: z.object({ id: z.string() }),
});
