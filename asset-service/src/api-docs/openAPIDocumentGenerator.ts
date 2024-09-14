import { OpenAPIRegistry, OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";

import { name, version } from "../../package.json";
import { env } from "../common/utils/envConfig";

import { healthCheckRegistry } from "../api/healthCheck/healthCheckRouter";
import { assetRegistry } from "../api/asset/assetRouter";

export function generateOpenAPIDocument() {
  const registry = new OpenAPIRegistry([healthCheckRegistry, assetRegistry]);
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      title: `${name} API documentation`,
      version,
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/v1`,
      },
    ],
    externalDocs: {
      description: "View the raw OpenAPI Specification in JSON format",
      url: "/swagger.json",
    },
  });
}
