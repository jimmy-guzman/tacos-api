import { OpenAPIHono } from "@hono/zod-openapi";

export const hono = () => {
  const app = new OpenAPIHono({
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

  return app;
};
