import { z } from "zod";

export const ReplySchema = z.object({
    text: z.string().min(1),
    assetUrls: z.array(z.string().url()).default([]),
});

export const UpdateReplySchema = z.object({
    text: z.string().min(1),
    assetUrls: z.array(z.string().url()),
});
