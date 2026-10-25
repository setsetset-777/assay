import { useNavigate } from "@tanstack/react-router";
import { type FormValues } from "@/schemas/form";
import { FieldRenderer, Form } from "@/components/form";
import { Button } from "@/components/Button";
import {
  useFormContext,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";

import "./Step.scss";
import { useFormStep } from "@/hooks/useFormStep";

export function Step() {
  const {
    steps,
    step,
    stepIndex,
    formId,
    nextStepId,
    previousStepId,
    isLast,
    isFirst,
  } = useFormStep();

  const navigate = useNavigate();

  const { trigger, handleSubmit } = useFormContext<FormValues>();

  const names = step.fields.map(({ name }) => name);

  const { title, i18n: setpI18n, fields } = step;

  const goTo = (n: number | string) => {
    console.log("goTo", n);
    navigate({
      to: "/form/$formId/step/$stepId",
      params: { formId, stepId: `${n}` },
    });
  };

  const onNext = async () => {
    if (isLast) return;
    const valid = await trigger(names);
    if (valid) {
      goTo(nextStepId);
    }
  };

  const onSave: SubmitHandler<FormValues> = async (data) => {
    // TODO persist data on storage
    if (!isLast) return;
    // Success
    goTo("success");
  };

  const onInvalid: SubmitErrorHandler<FormValues> = (errors) => {
    const errorIndex = steps.findIndex(({ fields }) =>
      fields.some(({ name }) => name in errors),
    );
    if (
      errorIndex >= 0 &&
      errorIndex < stepIndex &&
      steps[errorIndex] &&
      steps[errorIndex].id
    ) {
      goTo(steps[errorIndex].id);
    }
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
              onClick={() => goTo(previousStepId)}
            >
              {setpI18n?.previous ?? "Précédent"}
            </Button>
          )}
        </div>
        <div>
          <Button className="step__button" type="submit" variant="primary">
            {setpI18n?.next ?? (isLast ? "Envoyer" : "Suivant")}
          </Button>
        </div>
      </div>
    </Form>
  );
}
