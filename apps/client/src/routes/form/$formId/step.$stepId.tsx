import { createFileRoute, notFound } from "@tanstack/react-router";
import { type Form as FormType } from "@/schemas/form";
import { Step } from "@/components/Step";

export const Route = createFileRoute("/form/$formId/step/$stepId")({
  loader: async ({ params, parentMatchPromise }) => {
    const { loaderData } = await parentMatchPromise;
    const { formId, stepId } = params;
    const form = loaderData as FormType;
    const stepIndex = Number(stepId);
    const steps = form.steps;
    const step = steps[stepIndex - 1];

    if (!step) throw notFound();

    return { steps, step, stepIndex, formId };
  },
  component: StepComponent,
  notFoundComponent: () => {
    return <div>Step not found</div>;
  },
});

function StepComponent() {
  return <Step />;
}
