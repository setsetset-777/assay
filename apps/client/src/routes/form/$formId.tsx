import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { fetchForm } from "@/api";
import { FormProvider, useForm } from "react-hook-form";
import { formSchema, buildValuesSchema, type Form } from "@/schemas/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FormLayout } from "@/components/layout/FormLayout";

export const Route = createFileRoute("/form/$formId")({
  beforeLoad: async ({ params: { formId } }): Promise<{ form: Form }> => {
    const res = await fetchForm(formId);

    if (!res.ok) {
      throw notFound();
    }

    return {
      form: formSchema.parse({
        ...(await res.json()),
        route: formId,
      }),
    };
  },
  loader: async ({ context }): Promise<Form> => {
    return context.form;
  },
  component: PageComponent,
  notFoundComponent: () => {
    return <div>Form not found</div>;
  },
});

function PageComponent() {
  const form = Route.useLoaderData();

  const schema = useMemo(() => buildValuesSchema(form), [form]);

  const methods = useForm({
    resolver: zodResolver(schema),
  });

  const { title, editor, time } = form;

  return (
    <FormLayout title={title} editor={editor} time={time}>
      <FormProvider {...methods}>
        <Outlet />
      </FormProvider>
    </FormLayout>
  );
}
