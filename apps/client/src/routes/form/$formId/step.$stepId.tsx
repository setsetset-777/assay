import { createFileRoute, getRouteApi } from "@tanstack/react-router";

const formRoute = getRouteApi('/form/$formId');

export const Route = createFileRoute("/form/$formId/step/$stepId")({
  component: StepComponent,
  notFoundComponent: () => {
    return <div>Step not found</div>;
  },
});

function StepComponent() {
  const { formId, stepId } = Route.useParams();

  const form = formRoute.useLoaderData();

  const step = form.steps[stepId - 1];

  if (!step) {
    return;
  }

  return <div>Form: {formId}, Step: {step.title} yo</div>;
}
