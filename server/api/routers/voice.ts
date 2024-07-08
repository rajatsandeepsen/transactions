import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { getTranscript, groq } from "~/lib/voice";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const voiceRoute = createTRPCRouter({
    getVoiceText: protectedProcedure
        .input(z.object({ input: z.any() }))
        .mutation(async ({ input, ctx }) => {
            const data = input.input as File

            if (typeof data === "string") throw new TRPCError({ code: "UNSUPPORTED_MEDIA_TYPE", message: "Invalid data" });

            const { text } = await groq.audio.transcriptions.create({
                file: data,
                model: "whisper-large-v3",
            });
    
            return text.trim() || null;

            // const transcript = await getTranscript(data);
            // if (!transcript) throw new TRPCError({ code: "UNPROCESSABLE_CONTENT", message: "Failed to get transcript" });

            // return transcript;
        })
});
