import { useNavigate } from "@tanstack/react-router";
import { type FormValues } from "@/schemas/form";
import { FieldRenderer, Form } from "@/components/form";
import { Button } from "@/components/Button";
import {
  useFormContext,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import { useEffect, useState } from "react";
import { Route } from "@/routes/form/$formId/step.$stepId";

import "./Step.scss";

export function Step() {
  const { steps, step, stepIndex, formId } = Route.useLoaderData();
  const [nextStepIndex, setNextStepIndex] = useState<number | null>(null);
  const [prevStepIndex, setPrevStepIndex] = useState<number | null>(null);

  const navigate = useNavigate();

  const { trigger, handleSubmit } = useFormContext<FormValues>();

  const names = step.fields.map(({ name }) => name);

  const { title, i18n: setpI18n, fields } = step;

  useEffect(() => {
    setNextStepIndex(stepIndex < steps.length ? stepIndex + 1 : null);
    setPrevStepIndex(stepIndex > 1 ? stepIndex - 1 : null);
  }, [stepIndex]);

  const isLast = nextStepIndex === null;
  const isFirst = prevStepIndex === null;

  const goTo = (n: number) => {
    navigate({
      to: "/form/$formId/step/$stepId",
      params: { formId, stepId: `${n}` },
    });
  };

  const onNext = async () => {
    if (isLast) return;
    const valid = await trigger(names);
    if (valid) {
      goTo(nextStepIndex);
    }
  };

  const onSave: SubmitHandler<FormValues> = async (data) => {
    if (!isLast) return;
    // TODO persist data on storage
  };

  const onInvalid: SubmitErrorHandler<FormValues> = (errors) => {
    console.log("onInvalid", errors);
    const firstError = steps.findIndex(({ fields }) =>
      fields.some(({ name }) => name in errors),
    );
    if (firstError >= 0 && firstError < stepIndex - 1) goTo(firstError + 1);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    return isLast ? handleSubmit(onSave, onInvalid)(e) : onNext();
  };

  return (
    <Form onSubmit={onSubmit} className="step">
      <h1 className="step__title">{title}</h1>
      <div className="step__fields">
        {fields.map((props) => (
          <FieldRenderer key={props.name} {...props} />
        ))}
      </div>
      <div className="step__footer">
        <div>
          {!isFirst && (
            <Button
              className="step__button"
              type="button"
              variant="secondary"
              onClick={() => goTo(prevStepIndex)}
            >
              {setpI18n?.previous ?? "Précédent"}
            </Button>
          )}
        </div>
        <div>
          <Button className="step__button" type="submit" variant="primary">
            {setpI18n?.next ?? "Suivant"}
          </Button>
        </div>
      </div>
    </Form>
  );
}
