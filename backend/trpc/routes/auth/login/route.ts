import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { TRPCError } from "@trpc/server";

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123", // Change this in production!
};

export const loginProcedure = publicProcedure
  .input(
    z.object({
      username: z.string(),
      password: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    if (
      input.username === ADMIN_CREDENTIALS.username &&
      input.password === ADMIN_CREDENTIALS.password
    ) {
      return {
        success: true,
        token: "admin-token-" + Date.now(),
        user: {
          username: input.username,
          role: "admin",
        },
      };
    }

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Invalid credentials",
    });
  });
