export const test = "test";

import * as z from "zod";

const uniqueName = <T extends { name: string }>(
  items: T[],
  ctx: z.RefinementCtx,
) => {
  const seen = new Set<string>();

  items.forEach((item, index) => {
    if (seen.has(item.name)) {
      ctx.addIssue({
        code: "custom",
        message: `Duplicate name: "${item.name}"`,
        path: [index, "name"],
      });
    }

    seen.add(item.name);
  });
};

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

export const formSchema = z.object({
  id: z.string(),
  title: z.string(),
  route: z.string(),
  steps: z.array(
    z.object({
      title: z.string(),
      fields: z.array(fieldSchema).superRefine(uniqueName),
    }),
  ),
});

export type Form = z.infer<typeof formSchema>;
