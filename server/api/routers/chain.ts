import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { chain, init, materials } from "~/lib/model";
import { executeChainActions, type implementChain } from "initiative";
import { AllowALL, Schema, UserState, permissionZod } from "~/lib/schema";
// import { State } from "initiative";

export const chainRouter = createTRPCRouter({
  initiative: protectedProcedure
    .input(
      z.object({
        permissions: permissionZod.optional(),
        prompt: z.string(),
        state: z.object(UserState).optional()
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { permissions, prompt, state } = input;

      console.log(prompt, state);

      if (prompt.length === 0)
        return;

      const res = await chain.invoke(prompt, {
        state
        // ...
        // state ? {state: materials?.stateZod(state)} : {}
      });

      console.log(
        res.response.validated?.success ? res.response.validated.data : "",
      );

      const x = await executeChainActions(Schema, UserState, init as ReturnType<typeof implementChain>, res, {
        permissions: permissions ?? AllowALL,
        params: {
          ctx,
          extra: {},
        },
      });

      console.log(x);

      return x
    }),
});
