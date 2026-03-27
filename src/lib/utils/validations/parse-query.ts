import type { ZodSchema } from "zod";

export function parseQuery<T>(input: URLSearchParams, schema: ZodSchema<T>): T {
  const payload: Record<string, unknown> = {};

  for (const [key, value] of input.entries()) {
    if (value !== "") {
      payload[key] = value;
    }
  }

  return schema.parse(payload);
}
