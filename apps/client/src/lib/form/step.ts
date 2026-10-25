interface StepLike {
  id?: string;
}

export function resolveStepIndex<T extends StepLike[]>({
  isSuccess,
  steps,
  stepId,
}: {
  isSuccess: boolean;
  steps: T;
  stepId: string | undefined;
}): number {
  if (isSuccess) return steps.length;

  if (!stepId) return -1;

  const byId = steps.findIndex(({ id }) => id === stepId);
  if (byId >= 0) return byId;

  const byPosition = Number(stepId) - 1;
  return Number.isInteger(byPosition) &&
    byPosition >= 0 &&
    byPosition < steps.length
    ? byPosition
    : -1;
}

export function deriveFromStepId<T extends StepLike[]>({
  steps,
  stepId,
  isSuccess,
}: {
  isSuccess: boolean;
  steps: T;
  stepId: string | undefined;
}) {
  const stepIndex = resolveStepIndex({
    steps,
    stepId,
    isSuccess,
  });
  const step = steps[stepIndex];
  const totalSteps = steps.length;
  const isFirst = stepIndex === 0;
  const isLast = !isSuccess && stepIndex >= steps.length - 1;
  const nextStep = steps[stepIndex + 1];
  const nextStepId = nextStep && nextStep.id;
  const previousStep = steps[stepIndex - 1];
  const previousStepId = previousStep && previousStep.id;

  return {
    stepIndex,
    step,
    totalSteps,
    isFirst,
    isLast,
    nextStep,
    nextStepId,
    previousStep,
    previousStepId,
  };
}
