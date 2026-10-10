import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { FormSchema } from "@/schemas/form";

const formRoute = getRouteApi("/form/$formId");

export const Route = createFileRoute("/form/$formId/step/$stepId")({
  component: StepComponent,
  notFoundComponent: () => {
    return <div>Step not found</div>;
  },
});

function StepComponent() {
  const { formId, stepId } = Route.useParams();

  const form = FormSchema.parse(formRoute.useLoaderData());

  const step = form.steps[stepId - 1];

  if (!step) {
    return;
  }

  const { title, fields } = step;

  return (
    <div>
      <div>Form: {formId}</div>

      <div>Step: {title}</div>

      <div className="fields">
        {fields.map(({ name }) => (
          <div>{name}</div>
        ))}
      </div>
    </div>
  );
}
