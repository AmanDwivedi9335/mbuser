import type { FieldValues, Resolver } from "react-hook-form";
import type { ZodTypeAny } from "zod";

export function zodResolver<TSchema extends ZodTypeAny>(schema: TSchema): Resolver<FieldValues> {
  return async (values) => {
    const result = schema.safeParse(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors = result.error.issues.reduce<Record<string, { type: string; message: string }>>((acc, issue) => {
      const fieldName = issue.path.join(".");
      if (!fieldName) return acc;
      acc[fieldName] = {
        type: issue.code,
        message: issue.message,
      };
      return acc;
    }, {});

    return { values: {}, errors };
  };
}
