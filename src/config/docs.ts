export const openapi = {
  version: "3.1.1",
  info: {
    title: "Todos API",
    version: "0.0.0",
    description:
      "Schema first CRUD API starter with Hono, Drizzle and Better Auth.",
  },
  links: {
    hono: "https://hono.dev",
    drizzle: "https://orm.drizzle.team/",
    betterAuth: "https://www.better-auth.com/",
    github: "https://github.com/jimmy-guzman/hono-starter",
  },
};

export const humanDescription = `${openapi.info.description}

Built with [Hono](${openapi.links.hono}), [Drizzle](${openapi.links.drizzle}) and [Better Auth](${openapi.links.betterAuth}).

## Resources
- [Full LLM Documentation](/llms.txt)
- [Better Auth OpenAPI Documentation](/docs?api=auth)
- [Full OpenAPI JSON](/openapi.json)
- [GitHub Repository](${openapi.links.github})
`;

export const llmIndexMarkdown = `# ${openapi.info.title} - LLM Documentation

${openapi.info.description}

## Available LLM Documentation

### /api-llms.txt - API Endpoints
Complete reference for all API endpoints, request/response schemas, and usage examples.
Fetch this when you need to make API calls or understand available operations.

### /auth-llms.txt - Authentication  
Authentication and authorization documentation including setup, token management, and security best practices.
Fetch this when implementing auth or troubleshooting authentication issues.

## Quick Start for LLMs

1. Read /auth-llms.txt to understand authentication
2. Read /api-llms.txt to see available endpoints
3. Start making authenticated API calls

## Human-Readable Resources

- Interactive Documentation: /docs
- OpenAPI Specification: /openapi.json
- GitHub Repository: ${openapi.links.github}
`;
