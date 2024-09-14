import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type Vote = z.infer<typeof VoteSchema>;

export const VoteSchema = z.object({
  id: z.number(),
  vote: z.number(),
});

export const GetVoteSchema = z.object({
  params: z.object({ id: z.string() }),
});
