import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink, openAPI } from "better-auth/plugins";

import db from "@/db/client";
import * as schema from "@/db/schemas/auth";
import { sendEmail } from "./email";

export const auth = betterAuth({
  basePath: "/auth",
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: schema,
  }),
  plugins: [
    openAPI({ disableDefaultReference: true }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmail({
          html: `
            <div style="text-align: center; font-family: sans-serif;">
              <h1>Welcome to Hono Starter</h1>
              <p>Click below to sign in:</p>
              <a href="${url}" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background: black; color: white; text-decoration: none; border-radius: 8px;">Sign in</a>
              <p style="margin-top: 24px; font-size: 12px; color: gray;">If you didn’t request this, you can ignore it.</p>
            </div>
          `,
          subject: "Your magic Hono Starter link ✨",
          to: email,
        });
      },
    }),
  ],
});
