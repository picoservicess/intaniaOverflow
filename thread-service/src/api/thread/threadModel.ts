import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type Thread = z.infer<typeof ThreadSchema>;

export const ThreadSchema = z.object({
  id: z.string(),        // UUID is a string
  title: z.string(),     // Title as a string
  content: z.string(),   // Content as a string
  createdAt: z.date(),   // Date as a JavaScript Date object
  createdBy: z.string(), // UUID as a string for createdBy
  updatedAt: z.date(),   // Date as a JavaScript Date object
  updatedBy: z.string(), // UUID as a string for updatedBy
});

export const GetThreadSchema = z.object({
  params: z.object({ id: z.string() }),
});
