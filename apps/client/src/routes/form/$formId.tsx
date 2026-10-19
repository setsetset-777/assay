import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { fetchForm } from "@/api";
import { FormProvider, useForm } from "react-hook-form";
import { formSchema, buildValuesSchema } from "@/schemas/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";

export const Route = createFileRoute("/form/$formId")({
  loader: async ({ params: { formId } }) => {
    const res = await fetchForm(formId);
    if (res.ok) {
      return await res.json();
    } else {
      throw notFound();
    }
  },
  component: PageComponent,
  notFoundComponent: () => {
    return <div>Form not found</div>;
  },
});

function PageComponent() {
  const form = formSchema.parse(Route.useLoaderData());

  const schema = useMemo(() => buildValuesSchema(form), [form]);

  const methods = useForm({
    resolver: zodResolver(schema),
  });
  return (
    <FormProvider {...methods}>
      <div>
        <div>{form.title}</div>
        <Outlet />
      </div>
    </FormProvider>
  );
}
