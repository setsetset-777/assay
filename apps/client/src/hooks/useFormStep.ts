import { getRouteApi, useMatches, useParams } from "@tanstack/react-router";
import { deriveFromStepId } from "@/lib/form/step";

const formRoute = getRouteApi("/form/$formId");

export function useFormStep() {
  const { formId, stepId } = useParams({ strict: false });
  const { steps } = formRoute.useLoaderData();
  const isSuccess = useMatches({
    select: (matches) =>
      matches.some((match) => {
        return match.staticData.isSuccess === true;
      }),
  });

  if (!formId) {
    throw Error("No form id found");
  }

  return {
    formId,
    stepId,
    steps,
    ...deriveFromStepId({
      isSuccess,
      steps,
      stepId,
    }),
  };
}
