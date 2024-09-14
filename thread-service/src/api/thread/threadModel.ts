import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type Thread = z.infer<typeof ThreadSchema>;

export const ThreadSchema = z.object({
  id: z.number(),
  content: z.string(),
});

export const GetThreadSchema = z.object({
  params: z.object({ id: z.string() }),
});
