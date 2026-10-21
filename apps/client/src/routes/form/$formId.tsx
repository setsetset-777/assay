import {
  createFileRoute,
  notFound,
  Outlet,
  useChildMatches,
} from "@tanstack/react-router";
import { fetchForm } from "@/api";
import { FormProvider, useForm } from "react-hook-form";
import { formSchema, buildValuesSchema } from "@/schemas/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { FormLayout } from "@/components/layout/FormLayout";
import type { ProgressStep } from "@/types";

export const Route = createFileRoute("/form/$formId")({
  loader: async ({ params: { formId } }) => {
    const res = await fetchForm(formId);
    if (res.ok) {
      return {
        ...(await res.json()),
        route: formId,
      };
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

  const stepMatches = useChildMatches();
  const activeStep = stepMatches[0].loaderData.stepIndex;

  const schema = useMemo(() => buildValuesSchema(form), [form]);

  const methods = useForm({
    resolver: zodResolver(schema),
  });

  const { route, title, editor, time } = form;
  const steps = form.steps.map<ProgressStep>(({ title }, index) => ({
    title,
    href: stepMatches[0].fullPath
      .replace("$formId", route)
      .replace("$stepId", `${index + 1}`),
  }));

  return (
    <FormLayout
      title={title}
      editor={editor}
      time={time}
      steps={steps}
      activeStep={activeStep}
    >
      <FormProvider {...methods}>
        <Outlet />
      </FormProvider>
    </FormLayout>
  );
}
