import type { FieldErrors, Resolver } from "react-hook-form";
import type { z, ZodTypeAny } from "zod";

export function zodResolver<TSchema extends ZodTypeAny>(schema: TSchema): Resolver<z.input<TSchema>> {
  return async (values, _context, _options) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors: FieldErrors<z.input<TSchema>> = {};
    const flatErrors = errors as Record<string, { type: string; message: string }>;

    for (const issue of result.error.issues) {
      const fieldName = issue.path.join(".");
      if (!fieldName) continue;

      flatErrors[fieldName] = {
        type: issue.code,
        message: issue.message,
      };
    }

    return { values: {}, errors };
  };
}
