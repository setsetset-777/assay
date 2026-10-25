import { createFileRoute, notFound } from "@tanstack/react-router";
import { Step } from "@/components/Step";

export const Route = createFileRoute("/form/$formId/step/$stepId")({
  loader: async ({ params, context }) => {
    const { steps } = context.form;
    const { stepId } = params;

    const step = steps.find(({ id }) => id === stepId);

    if (!step) throw notFound();
  },
  component: StepComponent,
  notFoundComponent: () => {
    return <div>Step not found</div>;
  },
});

function StepComponent() {
  return <Step />;
}
