import { infer as Infer, z, type ZodObject, type input as Input, type ZodOptional } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { chain, init, materials, } from "~/lib/model";
import {executeChainActions, reExecuteChainActions} from "~/initiative";
import { AllowALL, type UserState } from "~/lib/schema";
import { permissionZod } from "~/lib/schema";

type state = ZodOptional<ZodObject<Partial<typeof UserState>>>
type stateInside = ZodOptional<ZodObject<typeof UserState>>

export const execute = createTRPCRouter({
  initiative: protectedProcedure
    .input(
      z.object({
        permissions: permissionZod.optional(),
        prompt: z.string(),
        state: materials.rawStateZod as unknown as state,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { permissions, prompt, state } = input;

      const response = await chain.invoke(prompt, {
        state: state as Input<stateInside>,
      });

      console.log(response)

      const initial = await executeChainActions(
        init,
        response,
        {
          permissions: permissions ?? AllowALL,
          params: {
            ctx,
            extra: {},
          },
        }
      );

      console.log(initial);

      return initial;
    }),
    reInitative: protectedProcedure
        .input(z.object({ previous: z.any(), permissions: permissionZod.optional(),}))
        .mutation(async ({ input, ctx }) => {
            const newResponse = await reExecuteChainActions(init, input.previous, {
                permissions: input.permissions ?? AllowALL,
                params: {
                    ctx: ctx,
                    extra: {},
                },
            });

            console.log(newResponse);

            return newResponse
        }),
});
