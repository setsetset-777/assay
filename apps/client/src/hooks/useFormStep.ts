import { useMatches, useParams } from "@tanstack/react-router";
import { Route } from "../routes/form/$formId";

export function useFormStep() {
  const { formId, stepId } = useParams({ strict: false });
  const { steps } = Route.useLoaderData();

  if (!formId) {
    throw Error("No form id found");
  }

  const isSuccess = useMatches({
    select: (matches) =>
      matches.some((match) => {
        return match.staticData.isSuccess === true;
      }),
  });

  // Step id is defined in config
  let stepIndex = isSuccess
    ? steps.length
    : steps.findIndex(({ id }) => id === stepId);

  // Step id is index + 1
  if (stepIndex < 0) {
    stepIndex = Number(stepId) - 1;
  }

  const step = steps[stepIndex];

  const totalSteps = steps.length;

  const isFirst = stepIndex === 0;
  const isLast = !isSuccess && stepIndex >= steps.length - 1;

  const nextStep = steps[stepIndex + 1];
  const nextStepId = nextStep && nextStep.id;

  const previousStep = steps[stepIndex - 1];
  const previousStepId = previousStep && previousStep.id;

  return {
    formId,
    stepId,
    stepIndex,
    step,
    steps,
    totalSteps,
    isFirst,
    isLast,
    nextStep,
    nextStepId,
    previousStep,
    previousStepId,
  };
}
