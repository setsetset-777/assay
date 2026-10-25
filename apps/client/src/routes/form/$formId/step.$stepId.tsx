import { createFileRoute, notFound } from "@tanstack/react-router";
import { Step } from "@/components/Step";
import { resolveStepIndex } from "@/lib/form/step";

export const Route = createFileRoute("/form/$formId/step/$stepId")({
  loader: async ({ params, context }) => {
    const { steps } = context.form;
    const { stepId } = params;

    const index = resolveStepIndex({
      isSuccess: false,
      steps,
      stepId,
    });

    if (index < 0) throw notFound();
  },
  component: StepComponent,
  notFoundComponent: () => {
    return <div>Step not found</div>;
  },
});

function StepComponent() {
  return <Step />;
}
