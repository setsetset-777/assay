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

export const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  route: z.string(),
  steps: z.array(
    z.object({
      title: z.string(),
      fields: z
        .array(
          z.object({
            name: z.string(),
            type: z.union([z.literal("text"), z.literal("textarea")]),
            required: z.boolean().optional(),
            placeholder: z.string().optional(),
          }),
        )
        .superRefine(uniqueName),
    }),
  ),
});

export type Form = z.infer<typeof FormSchema>;
