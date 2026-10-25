import { createFileRoute } from "@tanstack/react-router";
import type { Form as FormType } from "@/schemas/form";

export const Route = createFileRoute("/form/$formId/step/success")({
  staticData: {
    isSuccess: true,
  },
  loader: async ({
    parentMatchPromise,
  }): Promise<{
    stepIndex: number;
  }> => {
    const { loaderData } = await parentMatchPromise;
    const { steps } = loaderData as FormType;

    return {
      stepIndex: steps.length,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/form/$formId/step/success"!</div>;
}
