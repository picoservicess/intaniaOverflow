import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type Asset = z.infer<typeof AssetSchema>;

export const AssetSchema = z.object({
	assetUrl: z.string(),
});
