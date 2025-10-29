import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { loginProcedure } from "./routes/auth/login/route";
import { contentRouter } from "./routes/admin/content/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  auth: createTRPCRouter({
    login: loginProcedure,
  }),
  admin: createTRPCRouter({
    content: contentRouter,
  }),
});

export type AppRouter = typeof appRouter;
