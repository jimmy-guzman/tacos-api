import { OpenAPIHono } from "@hono/zod-openapi";
import { auth } from "./auth";

export const hono = () => {
  const app = new OpenAPIHono<{
    Variables: {
      user: typeof auth.$Infer.Session.user | null;
      session: typeof auth.$Infer.Session.session | null;
    };
  }>({
    defaultHook: (result, c) => {
      console.group(result);
      if (!result.success) {
        return c.json(
          {
            status: 422,
            message: "Your request did not match the expected schema.",
          },
          422,
        );
      }
    },
  });

  app.use("*", async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);

      return next();
    }

    c.set("user", session.user);
    c.set("session", session.session);

    return next();
  });

  return app;
};
