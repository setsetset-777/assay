import { createFileRoute, getRouteApi } from "@tanstack/react-router";
import { formSchema } from "@/schemas/form";
import { FieldRenderer } from "@/components/form";

const formRoute = getRouteApi("/form/$formId");

export const Route = createFileRoute("/form/$formId/step/$stepId")({
  component: StepComponent,
  notFoundComponent: () => {
    return <div>Step not found</div>;
  },
});

function StepComponent() {
  const { formId, stepId } = Route.useParams();

  const form = formSchema.parse(formRoute.useLoaderData());

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
        {fields.map((props) => {
          return <FieldRenderer key={props.name} {...props} />;
        })}
      </div>
    </div>
  );
}
