import { z } from "zod";

export function parseQuery<TSchema extends z.ZodTypeAny>(input: URLSearchParams, schema: TSchema): z.output<TSchema> {
  const payload: Record<string, unknown> = {};

  for (const [key, value] of input.entries()) {
    if (value !== "") {
      payload[key] = value;
    }
  }

  return schema.parse(payload);
}
