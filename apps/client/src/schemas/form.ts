export const test = "test";

import * as z from "zod";

const errors = {
  required: "Required",
};

const textblockType = "textblock";
const textblockValueSchema = undefined;

const textblockSchema = z.object({
  name: z.string(),
  type: z.literal(textblockType),
  value: z.string(),
});

export type textblock = z.infer<typeof textblockSchema>;

const textType = "text";
const textValueSchema = z.string(errors.required).min(2);

const textSchema = z.object({
  name: z.string(),
  type: z.literal(textType),
  label: z.string().optional(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  defaultValue: z.string().optional(),
});

export type Text = z.infer<typeof textSchema>;

const textareaType = "textarea";
const textareaValueSchema = z.string().optional();

const textareaSchema = z.object({
  name: z.string(),
  type: z.literal(textareaType),
  label: z.string().optional(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
  defaultValue: z.string().optional(),
});

export type Textarea = z.infer<typeof textareaSchema>;

export const fieldValueSchemas = {
  [textType]: textValueSchema,
  [textareaType]: textareaValueSchema,
  [textblockType]: textblockValueSchema,
} satisfies Record<FieldType, z.ZodType | undefined>;

export const fieldSchema = z.discriminatedUnion("type", [
  textSchema,
  textareaSchema,
  textblockSchema,
]);

export type Field = z.infer<typeof fieldSchema>;
export type FieldType = Field["type"];
export type FieldNames = Field["name"];
export type FieldOf<T extends FieldType> = Extract<Field, { type: T }>;

const i18nSchema = (keys: string[]) =>
  z.partialRecord(z.literal(keys), z.string()).optional();

export const stepSchema = z.object({
  title: z.string(),
  i18n: i18nSchema(["previous", "next"]),
  fields: z.array(fieldSchema),
});

export type Step = z.infer<typeof stepSchema>;

export const stepsSchema = z.array(stepSchema);

export type Steps = z.infer<typeof stepsSchema>;

export const formSchema = z.object({
  id: z.string(),
  title: z.string(),
  route: z.string(),
  editor: z.string().optional(),
  time: z.string().optional(),
  steps: stepsSchema.superRefine((steps, ctx) => {
    const seen = new Set<string>();

    steps.forEach(({ fields }) => {
      fields.forEach(({ name }, index) => {
        if (seen.has(name)) {
          ctx.addIssue({
            code: "custom",
            message: `Duplicate name: "${name}"`,
            path: [index, "name"],
          });
        }

        seen.add(name);
      });
    });
  }),
});

export type Form = z.infer<typeof formSchema>;

export type FieldValue = z.infer<(typeof fieldValueSchemas)[FieldType]>;
export type FormValues = Record<FieldNames, FieldValue | undefined>;

export const buildValuesSchema = (form: Form) => {
  const shape: Partial<Record<FieldNames, z.ZodType>> = {};

  for (const step of form.steps) {
    for (const { name, type } of step.fields) {
      const valueSchema = fieldValueSchemas[type];
      console.log(type, valueSchema);
      if (!valueSchema) continue;
      shape[name as string] = valueSchema;
    }
  }

  return z.object(shape);
};
