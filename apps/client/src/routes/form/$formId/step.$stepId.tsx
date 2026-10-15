import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { type FormValues, type Form as FormType } from "@/schemas/form";
import { FieldRenderer, Form } from "@/components/form";
import { Button } from "@/components/Button";
import { useFormContext, type SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";

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
  const { steps, step, stepIndex, formId } = Route.useLoaderData();
  const [nextStepIndex, setNextStepIndex] = useState<number | null>(null);
  const [prevStepIndex, setPrevStepIndex] = useState<number | null>(null);

  const navigate = useNavigate();

  const { trigger, handleSubmit } = useFormContext<FormValues>();

  const names = step.fields.map(({ name }) => name);

  const { title, fields } = step;

  useEffect(() => {
    setNextStepIndex(stepIndex < steps.length ? stepIndex + 1 : null);
    setPrevStepIndex(stepIndex > 1 ? stepIndex - 1 : null);
  }, [stepIndex]);

  const isLast = nextStepIndex === null;
  const isFirst = prevStepIndex === null;

  const goTo = (n: number) => {
    console.log("goto", n);
    navigate({
      to: "/form/$formId/step/$stepId",
      params: { formId, stepId: `${n}` },
    });
  };

  const onNext = async () => {
    if (isLast) return;
    console.log("onNext", names);
    const valid = await trigger(names);
    console.log(valid);
    if (valid) {
      goTo(nextStepIndex);
    }
  };

  const onSave: SubmitHandler<FormValues> = async (data) => {
    if (!isLast) return;
    // TODO persist data on storage
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("onSubmit", isLast);
    return isLast ? handleSubmit(onSave)(e) : onNext();
  };

  return (
    <Form onSubmit={onSubmit}>
      <div>Form: {formId}</div>

      <div>Step: {title}</div>

      <div className="fields">
        {fields.map((props) => (
          <FieldRenderer key={props.name} {...props} />
        ))}
      </div>
      {!isFirst && (
        <Button type="button" onClick={() => goTo(prevStepIndex)}>
          Previous
        </Button>
      )}
      <Button type="submit">Next</Button>
    </Form>
  );
}
