import { OpenAPIHono } from "@hono/zod-openapi";

import { env } from "@/env";

export const hono = () =>
  new OpenAPIHono({
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
