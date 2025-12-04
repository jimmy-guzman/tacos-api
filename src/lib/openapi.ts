import type { Swagger } from "atlassian-openapi";
import { isErrorResult, merge } from "openapi-merge";

export const prependPath = <T extends { paths: Record<string, unknown> }>(
  schema: T,
  prefix: string,
) => {
  return {
    ...schema,
    paths: Object.fromEntries(
      Object.entries(schema.paths).map(([path, value]) => [
        `${prefix}${path}`,
        value,
      ]),
    ),
  };
};

export const mergeSchemas = (inputs: { oas: unknown; basePath?: string }[]) => {
  const mergedResult = merge(
    inputs.map(({ oas, basePath }) => ({
      oas: oas as Swagger.SwaggerV3,
      pathModification: { prepend: basePath },
    })),
  );

  if (isErrorResult(mergedResult)) {
    throw new Error(`Failed to merge OpenAPI schemas: ${mergedResult.message}`);
  }

  return mergedResult.output;
};
