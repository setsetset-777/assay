export const test = "test";

import * as z from "zod";

const textSchema = z.object({
  name: z.string(),
  type: z.literal("text"),
  label: z.string().optional(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
});

export type Text = z.infer<typeof textSchema>;

const textareaSchema = z.object({
  name: z.string(),
  type: z.literal("textarea"),
  label: z.string().optional(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  description: z.string().optional(),
});

export type Textarea = z.infer<typeof textareaSchema>;

const fieldSchema = z.discriminatedUnion("type", [textSchema, textareaSchema]);

export type Field = z.infer<typeof fieldSchema>;
export type FieldType = Field["type"];
export type FieldOf<T extends FieldType> = Extract<Field, { type: T }>;

export const stepSchema = z.object({
  title: z.string(),
  fields: z.array(fieldSchema),
});

export type Step = z.infer<typeof stepSchema>;

export const stepsSchema = z.array(stepSchema);

export type Steps = z.infer<typeof stepsSchema>;

export const formSchema = z.object({
  id: z.string(),
  title: z.string(),
  route: z.string(),
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
